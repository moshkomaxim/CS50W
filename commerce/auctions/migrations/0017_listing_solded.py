# Generated by Django 5.0.2 on 2024-03-04 18:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0016_watchlist'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='solded',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
