from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.urls import reverse
import json

from .models import User, Post, Comment, PostLike, CommentLike


def index(request):
    return render(request, "network/index.html")


def get_posts(request):
    objects = Post.objects.all().order_by("-timestamp")
    start = int(request.GET.get("start") or 0)
    load_posts = int(request.GET.get("load") or 10)
    end = start + load_posts

    print(start, load_posts, end)

    response = []
    for post in objects[start:end]:
        post = post.serialize()
        user_liked = PostLike.objects.filter(user=request.user.id, post=post["id"])
        post.update({"user_liked": True if user_liked else False})
        response.append(post)
        
    return JsonResponse({"posts": response}, safe=False)


def leave_post(request):
    text = request.GET(["text"])
    object = Post(
        user = request.user,
        text = text
    )
    object.save()
    return HttpResponse("Succesfull")


def leave_comment(request):
    id = request.GET(["id"])
    text = request.GET(["text"])
    object = Comment(
        user = request.user,
        post = id,
        text = text
    )
    object.save()
    return HttpResponse("succesfull")


@csrf_exempt
@login_required
def like_post(request):
    if request.method != "POST":
        print("ERROR")
        return JsonResponse({"error": "POST request required."}, status=400)
    
    data = json.loads(request.body)
    print(data)

    id = int(data.get("id"))
    change = data.get("change")

    if change == "like":
        object = PostLike(user=request.user, post=Post.objects.filter(id=id).first())
        object.save()
    elif change == "dislike":
        object = PostLike.objects.filter(user=request.user, post=id)
        object.delete()

    return JsonResponse({"message": "Email sent successfully."}, status=201)





def like_comment(request):
    id = request.GET("id")
    object = CommentLike(user=request.user, commment=id)
    object.save()
    return HttpResponse("succesfull")


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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


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
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
