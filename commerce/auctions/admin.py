from django.contrib import admin

from .models import User, Listing, Bid, Category, Comment, WatchList
# Register your models here.

admin.site.register(User)
admin.site.register(Listing)
admin.site.register(Bid)
admin.site.register(Category)
admin.site.register(Comment)
admin.site.register(WatchList)