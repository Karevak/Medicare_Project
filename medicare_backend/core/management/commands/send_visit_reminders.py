from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from core.models import Visite, PushToken
from core.utils import send_reminder_email, send_push_notification

class Command(BaseCommand):
    help = "Envoie les rappels (emails + push) pour les visites du lendemain."

    def handle(self, *args, **kwargs):
        target_date = (timezone.now() + timedelta(days=1)).date()
        visites = Visite.objects.filter(date__date=target_date)
        
        sent = 0
        for v in visites:
            user = v.patient.user
            if user.email:
                send_reminder_email(
                    "Rappel de visite médicale",
                    f"Bonjour {user.username}, visite prévue le {v.date.strftime('%d/%m/%Y %H:%M')}.",
                    [user.email]
                )
            
            for pt in PushToken.objects.filter(user=user):
                send_push_notification(
                    pt.token, 
                    "Rappel de visite",
                    f"Visite le {v.date.strftime('%d/%m %H:%M')} avec {v.soignant.user.username}"
                )
            sent += 1

        self.stdout.write(self.style.SUCCESS(f"Rappels envoyés: {sent}"))