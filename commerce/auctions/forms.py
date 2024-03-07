from django import forms
from django.forms import ModelForm, TextInput, NumberInput, URLInput, Select, Textarea, EmailInput, PasswordInput
from .models import Listing, Comment, Bid, User

class LoginForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'password']
        widgets = {
            'username': TextInput(attrs= {
                'id': 'username',
                'class': 'form-control',
                'placeholder': 'Username'
            }),
            'password': PasswordInput(attrs= {
                'id': 'password',
                'class': 'form-control',
                'placeholder': 'Password'
            })
        }


class RegisterForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        widgets = {
            'username': TextInput(attrs= {
                'id': 'username',
                'class': 'form-control',
                'placeholder': 'Username'
            }),
            'email': EmailInput(attrs= {
                'id': 'email',
                'class': 'form-control',
                'placeholder': 'Email'
            }),
            'password': PasswordInput(attrs= {
                'id': 'password',
                'class': 'form-control',
                'placeholder': 'Password'
            }),
        }


class ListingForm(forms.ModelForm):
    class Meta:
        model = Listing
        fields = ['name', 'description', 'category', 'price', 'image']
        widgets = {
            'name': TextInput(attrs= {
                'idd': 'Name',
                'class': 'form-control',
                'placeholder': 'Name'
            }),
            'description': Textarea(attrs= {
                'id': 'Description',
                'class': 'form-control',
                'placeholder': 'Description'
            }),
            'category': Select(attrs= {
                'id': 'Category',
                'class': 'form-control',
            }),
            'price': NumberInput(attrs= {
                'id': 'Price',
                'class': 'form-control',
                'placeholder': 'Price'
            }),
            'image': URLInput(attrs= {
                'id': 'Image',
                'class': 'form-control',
                'placeholder': 'Image'
            })
            
        }

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['text']
        widgets = {
            'text': Textarea(attrs= {
                'id': 'text',
                'class': 'form-control',
                'placeholder': 'Write your comment'
            })
        }


class BidForm(forms.ModelForm):
    class Meta:
        model = Bid
        fields = ['price']
        widgets = {
            'price': NumberInput(attrs= {
                'id': 'price',
                'class': 'form-control',
                'placeholder': ''
            })
        }