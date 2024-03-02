from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Category(models.Model):
    category_name = models.CharField(max_length=20)

class Bids(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="users_bids")
    bid = models.IntegerField()

class Listing(models.Model):
    name = models.CharField(max_length=20)
    price = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="categories")
    #image = models.ImageField()
    listed_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listed_by")
    bids = models.ManyToManyField(Bids, null=True, blank=True, related_name="bids")

