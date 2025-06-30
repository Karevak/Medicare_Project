from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLES = (('admin', 'Administrateur'), ('soignant', 'Soignant'), ('patient', 'Patient'))
    role = models.CharField(max_length=20, choices=ROLES)

class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    birth_date = models.DateField()

class Soignant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    speciality = models.CharField(max_length=100)

class Visite(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    soignant = models.ForeignKey(Soignant, on_delete=models.CASCADE)
    date = models.DateTimeField()
    compte_rendu = models.TextField(blank=True)

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
