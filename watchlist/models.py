from django.db import models
from django.contrib.auth.models import User


from django.db import models
from django.contrib.auth.models import User

class Media(models.Model):
    title = models.CharField(max_length=255)
    media_type = models.CharField(max_length=50, default='Movie')
    status = models.CharField(max_length=50, default='Unwatched')
    tmdb_id = models.IntegerField(blank=True, null=True)
    poster_path = models.CharField(max_length=255, blank=True, null=True)
    overview = models.TextField(blank=True, null=True)
    release_date = models.CharField(max_length=50, blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, blank=True, null=True) # <-- Add this
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.title