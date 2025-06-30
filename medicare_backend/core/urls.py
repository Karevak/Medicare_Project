from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet, SoignantViewSet, VisiteViewSet, MessageViewSet, send_visite_reminder, save_push_token

router = DefaultRouter()
router.register('patients', PatientViewSet)
router.register('soignants', SoignantViewSet)
router.register('visites', VisiteViewSet)
router.register('messages', MessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('send_reminders/', send_visite_reminder),
    path('save_push_token/', save_push_token),
]
