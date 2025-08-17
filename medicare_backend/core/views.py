from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from .models import Patient, Soignant, Visite, Message, Soin, PushToken
from .serializers import *
from .utils import send_reminder_email, send_push_notification
from datetime import datetime, timedelta

@api_view(['GET'])
@permission_classes([AllowAny])
def healthcheck(request):
    return Response({"status": "ok"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(UserSerializer(request.user).data)

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

class SoignantViewSet(viewsets.ModelViewSet):
    queryset = Soignant.objects.all()
    serializer_class = SoignantSerializer

class VisiteViewSet(viewsets.ModelViewSet):
    queryset = Visite.objects.all()
    serializer_class = VisiteSerializer

class SoinViewSet(viewsets.ModelViewSet):
    queryset = Soin.objects.all()
    serializer_class = SoinSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return Soin.objects.filter(patient__user=user).order_by('-date')
        elif user.role == 'soignant':
            return Soin.objects.filter(soignant__user=user).order_by('-date')
        return Soin.objects.all().order_by('-date')

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        user = request.user
        if user.role == 'patient' and obj.patient.user != user:
            return Response({'error': 'Accès interdit'}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        user = request.user
        if user.role == 'patient' and obj.patient.user != user:
            return Response({'error': 'Accès interdit'}, status=403)
        return super().destroy(request, *args, **kwargs)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_push_token(request):
    token = request.data.get('token')
    user = request.user
    if token:
        PushToken.objects.update_or_create(user=user, defaults={'token': token})
        return Response({'status': 'Token enregistré'})
    return Response({'error': 'Token manquant'}, status=400)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def send_visite_reminder(request):
    tomorrow = datetime.now().date() + timedelta(days=1)
    visites = Visite.objects.filter(date__date=tomorrow)
    
    for visite in visites:
        email = visite.patient.user.email
        if email:
            send_reminder_email(
                "Rappel de visite médicale",
                f"Bonjour {visite.patient.user.username}, vous avez une visite prévue le {visite.date}.",
                [email],
            )
        
        # Notifications push
        tokens = PushToken.objects.filter(user=visite.patient.user)
        for t in tokens:
            send_push_notification(
                t.token,
                "Rappel de visite",
                f"Visite prévue le {visite.date.strftime('%d/%m %H:%M')} avec {visite.soignant.user.username}"
            )
    
    return Response({"status": f"Rappels envoyés pour {visites.count()} visites"})