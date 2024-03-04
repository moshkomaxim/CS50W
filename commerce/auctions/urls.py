from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("categories", views.categories, name="categories"),
    path("categories/<str:category_name>", views.category, name="category"),
    path("my_listings", views.my_listings, name="my_listings"),
    path("my_listings/archive", views.my_listings_archive, name="my_listings_archive"),
    path("view/<int:item_id>", views.item, name="item"),
    path("view/<int:item_id>/add_watch_list", views.add_watch_list, name="add_watch_list"),
    path("view/<int:item_id>/add_comment", views.add_comment, name="add_comment"),
    path("view/<int:item_id>/add_bid", views.add_bid, name="add_bid"),
    path("view/<int:item_id>/close_listing", views.close_listing, name="close_listing"),
    path("watchlist", views.watchlist, name="watchlist"),
    path("watchlist/<int:item_id>/delete", views.watchlist_delete, name="watchlist_delete"),
    path("create", views.create, name="create"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register")
]
