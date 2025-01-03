# Generated by Django 4.2 on 2024-12-21 19:36

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='note',
            old_name='description',
            new_name='content',
        ),
        migrations.RemoveField(
            model_name='note',
            name='title',
        ),
        migrations.AddField(
            model_name='note',
            name='audio_file',
            field=models.FileField(blank=True, null=True, upload_to='notes/'),
        ),
        migrations.AddField(
            model_name='note',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
