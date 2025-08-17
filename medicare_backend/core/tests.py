from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import User, Patient, Soignant, Soin
from rest_framework import status
from datetime import datetime

class SoinApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(username="admin", password="admin123", role="admin")
        self.patient_user = User.objects.create_user(username="pat", password="test123", role="patient")
        self.patient = Patient.objects.create(user=self.patient_user, address="rue", birth_date="2000-01-01")
        self.soignant_user = User.objects.create_user(username="soig", password="test123", role="soignant")
        self.soignant = Soignant.objects.create(user=self.soignant_user, speciality="Infirmier")

        # Login admin
        res = self.client.post('/api/token/', {"username": "admin", "password": "admin123"})
        self.token = res.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_create_soin(self):
        data = {
            "patient": self.patient.id,
            "soignant": self.soignant.id,
            "type": "visite",
            "description": "Visite de contrôle",
            "date": datetime.now().isoformat()
        }
        response = self.client.post('/api/soins/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_access_soins_patient(self):
        soin = Soin.objects.create(
            patient=self.patient, soignant=self.soignant, type="visite",
            description="Test", date=datetime.now()
        )
        
        # Login patient
        res = self.client.post('/api/token/', {"username": "pat", "password": "test123"})
        token = res.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        
        response = self.client.get('/api/soins/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(any(s['id'] == soin.id for s in response.data['results']))

    def test_security_access(self):
        other_user = User.objects.create_user(username="pat2", password="toto", role="patient")
        other_patient = Patient.objects.create(user=other_user, address="ruelle", birth_date="2002-01-01")
        soin = Soin.objects.create(
            patient=other_patient, soignant=self.soignant, type="acte",
            description="Acte", date=datetime.now()
        )
        
        res = self.client.post('/api/token/', {"username": "pat", "password": "test123"})
        token = res.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)
        
        response = self.client.get('/api/soins/')
        self.assertFalse(any(s['id'] == soin.id for s in response.data['results']))