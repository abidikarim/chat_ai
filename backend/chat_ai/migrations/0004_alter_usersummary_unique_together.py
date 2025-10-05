from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat_ai', '0003_alter_usersummary_unique_together'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='usersummary',
            unique_together={('user', 'language')},
        ),
    ]
