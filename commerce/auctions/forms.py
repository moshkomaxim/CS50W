from django import forms

from .models import Listing, Comment, Bid

class ListingForm(forms.ModelForm):
    class Meta:
        model = Listing
        fields = "__all__"
        exclude = ['author', 'sold_is', 'sold_date', 'sold_price', 'sold_to']


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = "__all__"
        exclude = ['user', 'item', 'created', 'deleted']


class BidForm(forms.ModelForm):
    class Meta:
        model = Bid
        fields = "__all__"
        exclude = ['user', 'item']