# Generated by Django 5.0.2 on 2024-03-02 17:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0005_remove_listing_bids_listing_bids'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bids',
            name='item',
        ),
    ]
