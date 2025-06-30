from rest_framework import viewsets, permissions
from .models import Patient, Soignant, Visite, Message
from .serializers import *
from rest_framework_simplejwt.views import TokenObtainPairView

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class SoignantViewSet(viewsets.ModelViewSet):
    queryset = Soignant.objects.all()
    serializer_class = SoignantSerializer

class VisiteViewSet(viewsets.ModelViewSet):
    queryset = Visite.objects.all()
    serializer_class = VisiteSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from .utils import send_reminder_email

@api_view(['POST'])
@permission_classes([IsAdminUser])
def send_visite_reminder(request):
    # exemple : envoie un mail à tous les patients ayant une visite demain
    from datetime import datetime, timedelta
    from .models import Visite

    tomorrow = datetime.now().date() + timedelta(days=1)
    visites = Visite.objects.filter(date__date=tomorrow)
    for visite in visites:
        email = visite.patient.user.email
        if email:
            send_reminder_email(
                "Rappel de visite médicale",
                f"Bonjour {visite.patient.user.username},\nVous avez une visite prévue le {visite.date}.",
                [email],
            )
    return Response({"status": "Rappels envoyés"})

from .models import PushToken
from .serializers import PushTokenSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_push_token(request):
    token = request.data.get('token')
    user = request.user
    if token:
        PushToken.objects.update_or_create(user=user, defaults={'token': token})
        return Response({'status': 'Token enregistré'})
    return Response({'error': 'Token manquant'}, status=400)
