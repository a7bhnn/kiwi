from rest_framework import serializers
from .models import Media
class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'title', 'media_type', 'status', 'owner', 'tmdb_id', 'poster_path', 'overview', 'release_date', 'rating']
        read_only_fields = ['owner']