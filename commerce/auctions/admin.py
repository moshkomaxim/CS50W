from django.contrib import admin

from .models import User, Listing, Bids, Category
# Register your models here.

class ListingAdmin(admin.ModelAdmin):
    filter_horizontal = ("bids", )
    
admin.site.register(User)
admin.site.register(Listing, ListingAdmin)
admin.site.register(Bids)
admin.site.register(Category)