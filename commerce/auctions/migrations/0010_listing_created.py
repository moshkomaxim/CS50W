# Generated by Django 5.0.2 on 2024-03-02 18:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0009_rename_bid_bid_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='created',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
