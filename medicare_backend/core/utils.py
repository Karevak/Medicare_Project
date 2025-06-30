from django.core.mail import send_mail
from django.conf import settings
import requests

def send_reminder_email(subject, message, recipient_list):
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        recipient_list,
        fail_silently=False,
    )

def send_push_notification(token, title, body):
    message = {
        'to': token,
        'sound': 'default',
        'title': title,
        'body': body,
    }
    requests.post('https://exp.host/--/api/v2/push/send', json=message)