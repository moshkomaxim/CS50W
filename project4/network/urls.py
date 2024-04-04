
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("following", views.following, name="following"),
    path("profile/<str:username>", views.get_profile, name="get_profile"),
    path("get_posts", views.get_posts, name="get_posts"),
    path("get_comments", views.get_comments, name="get_comments"),
    path("like_post", views.like_post, name="like_post"),
    path("like_comment", views.like_comment, name="like_comment"),
    path("follow_user", views.follow_user, name="follow_user"),
    path("leave_post", views.leave_post, name="leave_post"),
    path("edit_post", views.edit_post, name="edit_post"),
    path("get_followees_posts", views.get_followees_posts, name="get_followees_posts"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
