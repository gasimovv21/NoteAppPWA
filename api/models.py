from django.db import models
from django.contrib.auth.models import User
import uuid
import base64


class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField(blank=True, null=True)
    deadline = models.DateField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.body[0:50]


class SharedNote(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    shared_id = models.CharField(max_length=255, unique=True)

    def save(self, *args, **kwargs):
        if not self.shared_id:
            unique_id = base64.urlsafe_b64encode(uuid.uuid4().bytes).decode('utf-8').rstrip('=')
            self.shared_id = unique_id
        super().save(*args, **kwargs)


class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subscription_info = models.JSONField()  # Хранит JSON с данными подписки


class WebAuthnKey(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='webauthn_keys')
    credential_id = models.CharField(max_length=255, unique=True)  # Идентификатор ключа
    credential_data = models.BinaryField()  # Данные ключа
