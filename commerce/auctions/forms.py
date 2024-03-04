from django import forms

from .models import Listing, Comment, Bid

class ListingForm(forms.ModelForm):
    class Meta:
        model = Listing
        fields = "__all__"
        exclude = ['sold', 'author']


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