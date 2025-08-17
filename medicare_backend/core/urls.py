from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PatientViewSet, SoignantViewSet, VisiteViewSet, MessageViewSet, SoinViewSet,
    me, save_push_token, send_visite_reminder
)

router = DefaultRouter()
router.register('patients', PatientViewSet)
router.register('soignants', SoignantViewSet)
router.register('visites', VisiteViewSet)
router.register('messages', MessageViewSet)
router.register('soins', SoinViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('me/', me),
    path('save_push_token/', save_push_token),
    path('send_reminders/', send_visite_reminder),
]