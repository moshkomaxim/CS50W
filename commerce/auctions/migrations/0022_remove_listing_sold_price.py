# Generated by Django 5.0.2 on 2024-03-04 19:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0021_alter_listing_sold_price'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='listing',
            name='sold_price',
        ),
    ]
