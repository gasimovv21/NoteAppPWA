from django.db import models
from django.contrib.auth import get_user_model
import uuid
import base64

User = get_user_model()

class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField(blank=True, null=True)
    audio_file = models.FileField(upload_to='audio/', blank=True, null=True)  # Поле для аудиофайлов
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.body[0:50] if self.body else 'Empty Note'


class SharedNote(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    shared_id = models.CharField(max_length=255, unique=True)

    def save(self, *args, **kwargs):
        if not self.shared_id:
            unique_id = base64.urlsafe_b64encode(uuid.uuid4().bytes).decode('utf-8').rstrip('=')
            self.shared_id = unique_id
        super().save(*args, **kwargs)
