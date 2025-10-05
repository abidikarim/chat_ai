from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password

class Language(models.TextChoices):
    ENGLISH = "en", "English"
    ARABIC = "ar", "Arabic"

class User(AbstractUser):
    email = models.EmailField(unique=True)
    preferred_language = models.CharField(max_length=5, choices=Language.choices, default=Language.ENGLISH)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"] 

    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith("pbkdf2_"):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username
