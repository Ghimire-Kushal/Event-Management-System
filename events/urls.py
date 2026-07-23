from django.urls import path
from .views import EventViewSet, RegisterForEventView # Add RegisterForEventView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'list', EventViewSet, basename='event')

urlpatterns = [
    path('register-signup/<int:event_id>/', RegisterForEventView.as_view(), name='event_signup'),
] + router.urls