from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Media
from .serializers import MediaSerializer

class MediaListCreate(generics.ListCreateAPIView):
    serializer_class = MediaSerializer
    permission_classes = [IsAuthenticated] # Locks the endpoint down

    def get_queryset(self):
        # Only return movies that belong to the user making the request
        return Media.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the 'owner' to the logged-in user when saving
        serializer.save(owner=self.request.user)

class MediaDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MediaSerializer
    permission_classes = [IsAuthenticated] 

    def get_queryset(self):
        # Ensure users can only delete their own movies
        return Media.objects.filter(owner=self.request.user)
    
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

class RegisterView(APIView):
    permission_classes = [AllowAny] # Anyone can sign up!

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, password=password)
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)