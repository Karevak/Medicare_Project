from django.contrib import admin
from .models import User, Patient, Soignant, Visite, Message, Soin, PushToken

admin.site.register(User)
admin.site.register(Patient)
admin.site.register(Soignant)
admin.site.register(Visite)
admin.site.register(Message)
admin.site.register(Soin)
admin.site.register(PushToken)