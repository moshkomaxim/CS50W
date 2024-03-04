from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    pass

class Category(models.Model):
    category_name = models.CharField(max_length=20)


class Listing(models.Model):
    name = models.CharField(max_length=20)
    description = models.CharField(max_length=150)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listed_by")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="categories")
    price = models.IntegerField()
    image = models.URLField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    sold = models.BooleanField(default=False)


class Bid(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Listing, on_delete=models.CASCADE)
    price = models.IntegerField()


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Listing, on_delete=models.CASCADE)
    text = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    deleted = models.BooleanField(default=False)


class WatchList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Listing, on_delete=models.CASCADE)
