from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat_ai', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chathistory',
            name='model_used',
            field=models.CharField(choices=[('falcon3', 'Falcon 3'), ('llama3', 'LLaMA 3'), ('qwen2', 'Qwen 2')], default='falcon3', max_length=20),
        ),
    ]
