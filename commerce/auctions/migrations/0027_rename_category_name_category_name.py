# Generated by Django 5.0.2 on 2024-03-04 20:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0026_listing_sold_to'),
    ]

    operations = [
        migrations.RenameField(
            model_name='category',
            old_name='category_name',
            new_name='name',
        ),
    ]
