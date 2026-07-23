from rest_framework import viewsets, permissions
from .models import Notification
from .serializers import NotificationSerializer # You'll need to create this

class NotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Users only see their own notifications (Section 8)
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')