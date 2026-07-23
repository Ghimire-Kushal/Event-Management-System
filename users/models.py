from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Role definitions from Section 3
    ADMIN = 'admin'
    ORGANISER = 'organiser'
    PARTICIPANT = 'participant'
    
    ROLE_CHOICES = [
        (ADMIN, 'System Administrator'),
        (ORGANISER, 'Event Organiser'),
        (PARTICIPANT, 'Participant'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=PARTICIPANT)
    
    # Verification fields from Section 4
    is_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, blank=True, null=True)
    
    # Point system from Section 7
    total_points = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.username} ({self.role})"