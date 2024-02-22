from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("search", views.search, name="search"),
    path("create", views.create, name="create"),
    path("get_random", views.get_random, name="get_random"),
    path("<str:title>", views.title, name="title")
]
