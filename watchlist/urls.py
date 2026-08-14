from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MediaViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# The router automatically creates all standard REST routes
router = DefaultRouter()
router.register(r'media', MediaViewSet, basename='media')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    
    # Auth endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Watchlist endpoints
    path('api/', include('watchlist.urls')),
]