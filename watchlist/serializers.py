from rest_framework import serializers
from .models import Media
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username # Add the username to the token
        return token
class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'title', 'media_type', 'status', 'owner', 'tmdb_id', 'poster_path', 'overview', 'release_date', 'rating']
        read_only_fields = ['owner']