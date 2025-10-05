from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat_ai', '0002_alter_chathistory_model_used'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='usersummary',
            unique_together=set(),
        ),
    ]
