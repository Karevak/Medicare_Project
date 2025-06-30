from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet, SoignantViewSet, VisiteViewSet, MessageViewSet

router = DefaultRouter()
router.register('patients', PatientViewSet)
router.register('soignants', SoignantViewSet)
router.register('visites', VisiteViewSet)
router.register('messages', MessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
