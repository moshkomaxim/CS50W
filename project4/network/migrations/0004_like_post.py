# Generated by Django 5.0.2 on 2024-03-24 14:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0003_alter_post_comments_alter_post_likes'),
    ]

    operations = [
        migrations.AddField(
            model_name='like',
            name='post',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='network.post'),
        ),
    ]
