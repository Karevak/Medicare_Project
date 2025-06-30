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
