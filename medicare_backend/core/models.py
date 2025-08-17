from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLES = (('admin', 'Administrateur'), ('soignant', 'Soignant'), ('patient', 'Patient'))
    role = models.CharField(max_length=20, choices=ROLES)

class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    birth_date = models.DateField()

    def __str__(self):
        return f"Patient {self.user.username}"

class Soignant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    speciality = models.CharField(max_length=100)

    def __str__(self):
        return f"Soignant {self.user.username}"

class Visite(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    soignant = models.ForeignKey(Soignant, on_delete=models.CASCADE)
    date = models.DateTimeField()
    compte_rendu = models.TextField(blank=True)

    def __str__(self):
        return f"Visite {self.patient} - {self.date}"

class Soin(models.Model):
    VISITE = 'visite'
    ACTE = 'acte'
    TYPE_CHOICES = [
        (VISITE, 'Visite'),
        (ACTE, 'Acte'),
    ]
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    soignant = models.ForeignKey(Soignant, on_delete=models.SET_NULL, null=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    description = models.TextField()
    date = models.DateTimeField()
    visite = models.ForeignKey('Visite', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.type} - {self.patient.user.username} - {self.date.strftime('%d/%m/%Y')}"

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.receiver}: {self.content[:50]}"

class PushToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)

    def __str__(self):
        return f"Token {self.user.username}"