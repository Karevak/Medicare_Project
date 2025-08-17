from rest_framework import serializers
from .models import User, Patient, Soignant, Visite, Message, Soin, PushToken

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Patient
        fields = '__all__'

class SoignantSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Soignant
        fields = '__all__'

class VisiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visite
        fields = '__all__'

class SoinSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if not data.get('patient') or not data.get('type') or not data.get('date'):
            raise serializers.ValidationError("Champs obligatoires manquants")
        if data['type'] not in ['visite', 'acte']:
            raise serializers.ValidationError("Type de soin invalide")
        return data

    class Meta:
        model = Soin
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class PushTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = PushToken
        fields = '__all__'