from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'is_verified', 'total_points']

class RegisterSerializer(serializers.ModelSerializer):
    # FIXED: Changed write_mode=True to write_only=True
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        # Logic from Section 4: Determine Internal vs External
        email = validated_data['email']
        
        # We set the default role to 'participant' as per Section 3.3
        role = 'participant'
            
        user = User.objects.create_user(
            username=validated_data['username'],
            email=email,
            password=validated_data['password'],
            role=role,
            is_verified=False # Must verify via OTP first (Section 4)
        )
        return user