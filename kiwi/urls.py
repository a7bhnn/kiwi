from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from watchlist import views  # <-- Import your watchlist views
from watchlist.views import RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # JWT Authentication Endpoints
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    # Watchlist Endpoints
    path('api/media/', views.MediaListCreate.as_view(), name='media-list'), # <-- Add this line
    path('api/media/<int:pk>/', views.MediaDetail.as_view(), name='media-detail'), # <-- Add this line
]