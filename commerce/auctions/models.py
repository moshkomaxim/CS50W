from django.contrib.auth.models import AbstractUser
from django.db import models
from random import randint

class User(AbstractUser):
    display_name = models.CharField(max_length=12, default=f"User#{randint(1000, 100000)}")


class Category(models.Model):
    name = models.CharField(max_length=20)
    image = models.URLField(null=True, blank=True)

    def __str__(self):
        return self.name


class Listing(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=250)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listed_by")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="categories")
    price = models.IntegerField()
    image = models.URLField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    sold_is = models.BooleanField(default=False)
    sold_date = models.DateTimeField(blank=True, null=True)
    sold_price = models.IntegerField(blank=True, null=True)
    sold_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sold_to", null=True, blank=True)

    def __str__(self):
        return self.name


class Bid(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Listing, on_delete=models.CASCADE)
    price = models.IntegerField()

    def __str__(self):
        return f"{self.user.username} - {self.item}"


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Listing, on_delete=models.CASCADE)
    text = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.item}"


class WatchList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Listing, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.item}"