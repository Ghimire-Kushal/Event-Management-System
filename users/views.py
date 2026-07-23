from rest_framework import status, views
from rest_framework.response import Response
from .serializers import RegisterSerializer
from .models import User
import random

class RegisterView(views.APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            # 1. Save user basic info
            user = serializer.save()
            
            # 2. Set logic from Section 4: Internal vs External
            is_internal = email.endswith('@apollo.edu') 
            user.role = 'participant'
            user.user_type = 'internal' if is_internal else 'external'
            
            # 3. Generate and Save OTP
            user.otp = str(random.randint(100000, 999999))
            user.save()
            
            # 4. Print to terminal (for backend logs)
            print(f"DEBUG: OTP for {user.email} is {user.otp}") 
            
            # 5. FIXED: Include the OTP in the response so React can show it to you!
            return Response({
                "message": f"Registration successful. Your test OTP is: {user.otp}",
                "email": user.email,
                "is_internal": is_internal,
                "otp": user.otp  # Sent to frontend for easy testing
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(views.APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        try:
            # Find the user matching both email and OTP
            user = User.objects.get(email=email, otp=otp)
            user.is_verified = True
            user.otp = "" # Clear OTP after verification (Section 4 safety)
            user.save()
            return Response({"message": "Account verified successfully!"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)