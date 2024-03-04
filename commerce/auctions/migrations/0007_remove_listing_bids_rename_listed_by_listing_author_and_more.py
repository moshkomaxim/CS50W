# Generated by Django 5.0.2 on 2024-03-02 18:22

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0006_remove_bids_item'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='listing',
            name='bids',
        ),
        migrations.RenameField(
            model_name='listing',
            old_name='listed_by',
            new_name='author',
        ),
        migrations.AddField(
            model_name='listing',
            name='description',
            field=models.CharField(default='admin', max_length=150),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='listing',
            name='image',
            field=models.URLField(default='admin'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='listing',
            name='sold',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name='Bid',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bid', models.IntegerField()),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='auctions.listing')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.DeleteModel(
            name='Bids',
        ),
    ]
