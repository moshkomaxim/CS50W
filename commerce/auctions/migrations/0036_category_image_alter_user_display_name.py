# Generated by Django 5.0.2 on 2024-03-07 17:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0035_alter_user_display_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='image',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='display_name',
            field=models.CharField(default='User#32636', max_length=12),
        ),
    ]
