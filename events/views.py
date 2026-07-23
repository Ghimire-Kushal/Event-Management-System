from django.db import transaction
from django.db.models import Sum
from django.contrib.auth import get_user_model

from rest_framework import status, permissions, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Event, Registration
from .serializers import EventSerializer
from notifications.models import Notification

User = get_user_model()


# ---------------------------------------
# Event List API
# ---------------------------------------
class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


# ---------------------------------------
# Register for Event
# ---------------------------------------
class RegisterForEventView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, event_id):
        try:
            event = Event.objects.get(id=event_id)

            # Check event capacity
            if event.registrations.count() >= event.max_capacity:
                return Response(
                    {"error": "Event is full!"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            registration, created = Registration.objects.get_or_create(
                event=event,
                participant=request.user,
            )

            if not created:
                return Response(
                    {"message": "You are already registered for this event."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response(
                {"message": f"Successfully registered for {event.title}!"},
                status=status.HTTP_201_CREATED,
            )

        except Event.DoesNotExist:
            return Response(
                {"error": "Event not found"},
                status=status.HTTP_404_NOT_FOUND,
            )


# ---------------------------------------
# Mark Attendance
# ---------------------------------------
class MarkAttendanceView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, registration_id):
        try:
            with transaction.atomic():
                reg = Registration.objects.get(id=registration_id)

                if reg.attended:
                    return Response(
                        {"message": "Attendance already marked."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                # Mark attendance
                reg.attended = True
                reg.save()

                # Award points
                user = reg.participant
                points = reg.event.points_to_allocate

                user.total_points += points
                user.save()

                # Create notification
                Notification.objects.create(
                    user=user,
                    notification_type="Point Allocation",
                    message=f"You earned {points} points for attending {reg.event.title}!",
                )

                return Response(
                    {
                        "message": f"Attendance marked successfully. {points} points awarded to {user.username}."
                    },
                    status=status.HTTP_200_OK,
                )

        except Registration.DoesNotExist:
            return Response(
                {"error": "Registration not found."},
                status=status.HTTP_404_NOT_FOUND,
            )


# ---------------------------------------
# Admin Report
# ---------------------------------------
class AdminReportView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        stats = {
            "total_events": Event.objects.count(),
            "approved_events": Event.objects.filter(status="approved").count(),
            "total_registrations": Registration.objects.count(),
            "total_points_distributed": User.objects.aggregate(
                total=Sum("total_points")
            )["total"] or 0,
            "internal_participants": User.objects.filter(
                user_type="internal"
            ).count(),
            "external_participants": User.objects.filter(
                user_type="external"
            ).count(),
        }

        return Response(stats, status=status.HTTP_200_OK)