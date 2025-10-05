import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('ai_response', models.TextField()),
                ('language', models.CharField(choices=[('en', 'English'), ('ar', 'Arabic')], default='en', max_length=5)),
                ('model_used', models.CharField(choices=[('grok', 'Grok'), ('deepseek', 'DeepSeek'), ('llama', 'LLaMA')], default='llama', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chats', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='UserSummary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('language', models.CharField(choices=[('en', 'English'), ('ar', 'Arabic')], max_length=5)),
                ('summary_text', models.TextField()),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='summaries', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'language')},
            },
        ),
    ]
