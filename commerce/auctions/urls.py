from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("<int:item_id>/view", views.item, name="item"),
    path("<int:item_id>/add_watch_list", views.add_watch_list, name="add_watch_list"),
    path("<int:item_id>/add_comment", views.add_comment, name="add_comment"),
    path("watchlist", views.watchlist, name="watchlist"),
    path("watchlist/<int:item_id>/delete", views.watchlist_delete, name="watchlist_delete"),
    path("create", views.create, name="create"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
