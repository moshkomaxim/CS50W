
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("get_posts", views.get_posts, name="get_posts"),
    path("get_comments", views.get_comments, name="get_comments"),
    path("like_post", views.like_post, name="like_post"),
    path("like_comment", views.like_comment, name="like_comment"),
    path("leave_post", views.leave_post, name="leave_post"),
    path("edit_post", views.edit_post, name="edit_post"),
    path("like_comment", views.like_comment, name="like_comment"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
