# Generated by Django 5.0.2 on 2024-03-04 19:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0022_remove_listing_sold_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='sold_price',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
