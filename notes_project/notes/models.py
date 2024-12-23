from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class Note(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="notes", on_delete=models.CASCADE)
    content = models.TextField()
    audio_file = models.FileField(upload_to='notes/', null=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.content[:50]
