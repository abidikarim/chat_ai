from django.db import models
from django.conf import settings

class Language(models.TextChoices):
    ENGLISH = "en", "English"
    ARABIC = "ar", "Arabic"

class AIModel(models.TextChoices):
    FALCON3 = "falcon3", "Falcon 3"
    LLAMA3 = "llama3", "LLaMA 3"
    QWEN2 = "qwen2", "Qwen 2"

class ChatHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="chats")
    message = models.TextField()
    ai_response = models.TextField()
    language = models.CharField(max_length=5, choices=Language.choices, default=Language.ENGLISH)
    model_used = models.CharField(max_length=20, choices=AIModel.choices, default=AIModel.FALCON3)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.language} - {self.model_used} - {self.created_at}"

class UserSummary(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="summaries")
    language = models.CharField(max_length=5, choices=Language.choices)
    summary_text = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "language")
    
    def save(self, *args, **kwargs):
        if not self.language:
            self.language = self.user.preferred_language
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.email} - {self.language}"
