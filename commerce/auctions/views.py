from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .models import User, Listing, Comment, WatchList, Bid
from .forms import ListingForm, CommentForm


def index(request):
    items = Listing.objects.filter(sold=False)
    return render(request, "auctions/index.html", {
        "items": items
    })


def item(request, item_id):
    item_object = Listing.objects.get(id=item_id)       
    comments = Comment.objects.filter(item=item_id, deleted=False)
    comments_form = CommentForm()

    bids = Bid.objects.filter(item=item_object)
    bids_amount = bids.count()
    bids_max = 0

    for bid in bids:
        if bid.price > bids_max:
            bids_max = bid.price

    return render(request, "auctions/view.html", {
        "item": item_object,
        "comments": comments,
        "form": comments_form,
        "bids_amount": bids_amount,
        "bids_max": bids_max
    })


def add_watch_list(request, item_id):
    item = Listing.objects.get(id=item_id)
    user = request.user

    if WatchList.objects.filter(item=item, user=user):
        return HttpResponseRedirect(reverse("item", args=(item_id,)))

    object = WatchList()
    object.item = item
    object.user = user
    object.save()
    return HttpResponseRedirect(reverse("watchlist"))


def add_comment(request, item_id):
    item_object = Listing.objects.get(id=item_id)
    if request.method == "POST":
        form = CommentForm(request.POST)
        if form.is_valid():
            obj = form.save(commit=False)
            obj.user = request.user
            obj.item = item_object
            obj.save()
            return HttpResponseRedirect(reverse("item", args=(item_id,)))


def watchlist(request):
    user_object = request.user
    items = WatchList.objects.filter(user=user_object)
    return render(request, "auctions/watchlist.html", {
        "items": items
    })


def watchlist_delete(request, item_id):
    object = WatchList.objects.get(id=item_id)
    object.delete()
    return HttpResponseRedirect(reverse("watchlist"))


def create(request):
    if request.method == "POST":
        form = ListingForm(request.POST)
        if form.is_valid():
            obj = form.save(commit=False)
            obj.author = request.user
            obj.save()
        return HttpResponseRedirect(reverse("index"))
    
    else:
        form = ListingForm()
        return render(request, "auctions/create.html", {
            "form": form
        })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")
