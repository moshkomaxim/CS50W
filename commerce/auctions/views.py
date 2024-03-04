from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.messages import error
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime

from .models import User, Listing, Comment, WatchList, Bid, Category
from .forms import ListingForm, CommentForm, BidForm
from .utils import get_bids_info


def index(request):
    items = Listing.objects.filter(sold_is=False)
    return render(request, "auctions/index.html", {
        "items": items
    })


def categories(request):
    items = Category.objects.all()
    print(items)
    return render(request, "auctions/categories.html", {
        "categories": items
    })


def category(request, category_name):
    category = Category.objects.get(name=category_name)
    items = Listing.objects.filter(category=category, sold_is=False)
    return render(request, "auctions/category.html", {
        "items": items,
        "category": category_name
    })


def item(request, item_id):
    item_object = Listing.objects.get(id=item_id)       
    comments = Comment.objects.filter(item=item_id, deleted=False)
    comment_form = CommentForm()

    bids_info = get_bids_info(item_id)
    bid_form = BidForm()

    if request.user.is_authenticated:
        in_watch_list = WatchList.objects.filter(user=request.user, item=item_id).first()
        user_bid = Bid.objects.filter(user=request.user, item=item_id).first()
    else:
        in_watch_list = None
        user_bid = None
        
    return render(request, "auctions/view.html", {
        "item": item_object,
        "comments": comments,
        "comment_form": comment_form,
        "bid_form": bid_form,
        "bids_amount": bids_info["amount"],
        "bids_max": bids_info["max"],
        "user_bid": user_bid,
        "in_watchlist": in_watch_list,
        "is_author": item_object.author == request.user
    })


@login_required(login_url='/login')
def my_listings(request):
    items = Listing.objects.filter(author=request.user, sold_is=False)
    return render(request, "auctions/my_listings.html", {
        "items": items
    })


@login_required(login_url='/login')
def my_listings_archive(request):
    items = Listing.objects.filter(author=request.user, sold_is=True)
    return render(request, "auctions/my_listings_archive.html", {
        "items": items
    })


@login_required(login_url='/login')
def add_watch_list(request, item_id):
    if request.method == "POST":
        item = Listing.objects.get(id=item_id)
        user = request.user

        if WatchList.objects.filter(item=item, user=user):
            return HttpResponseRedirect(reverse("item", args=(item_id,)))

        object = WatchList()
        object.item = item
        object.user = user
        object.save()
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@login_required(login_url='/login')
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


@login_required(login_url='/login')
def add_bid(request, item_id):
    if request.method == "POST":
        user = request.user
        try:
            bid_exist = Bid.objects.get(item=item_id, user=user)
        except ObjectDoesNotExist:
            bid_exist = False
        
        bid_info = get_bids_info(item_id)
        item = Listing.objects.get(id=item_id)

        form = BidForm(request.POST)
        if form.is_valid():
            obj = form.save(commit=False)
            if obj.price <= bid_info["max"]:
                error(request, 'Your bid is less than maximum bid!')
                return HttpResponseRedirect(reverse("item", args=(item_id,)))
            elif obj.price <= item.price:
                error(request, 'Your bid is less than start bid!')
                return HttpResponseRedirect(reverse("item", args=(item_id,)))
            elif bid_exist:
                obj.id = bid_exist.id
            obj.user = user
            obj.item = Listing.objects.get(id=item_id)
            obj.save()
            return HttpResponseRedirect(reverse("item", args=(item_id,)))


@login_required(login_url='/login')
def close_listing(request, item_id):
    if request.method == "POST":
        bids_info = get_bids_info(item_id)
        user = request.user
        item = Listing.objects.get(id=item_id)
        item.sold_is = True
        item.sold_date = timezone.now()
        item.sold_price = bids_info["max"]
        item.sold_to = bids_info["max_user"]
        item.save()
        return HttpResponseRedirect(reverse("my_listings"))


@login_required(login_url='/login')
def watchlist(request):
    user_object = request.user
    items = WatchList.objects.filter(user=user_object)
    return render(request, "auctions/watchlist.html", {
        "items": items
    })


@login_required(login_url='/login')
def watchlist_delete(request, item_id):
    if request.method == "POST":
        object = WatchList.objects.get(item=item_id, user=request.user)
        object.delete()
        return HttpResponseRedirect(request.META.get('HTTP_REFERER'))


@login_required(login_url='/login')
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
            error(request, "Invalid username and/or password")
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
            error(request, "Password must match")
            return render(request, "auctions/register.html")

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            error(request, "Username already taken")
            return render(request, "auctions/register.html")
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")
