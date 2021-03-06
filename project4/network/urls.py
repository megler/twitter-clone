from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("network/profile/<int:pk>", views.user_profile, name="user_profile"),
    path("network/follow/<int:id>", views.follow, name="follow"),
    path("network/unfollow/<int:id>", views.unfollow, name="unfollow"),
    path("network/send-tweet/<int:pk>", views.send_tweet, name="send_tweet"),
    path("network/following/<int:pk>",
         views.user_following,
         name="user_following"),
    # API
    path("network/like", views.like, name="like"),
    path("network/get-tweet/<int:id>", views.get_tweet, name="get_tweet"),
    path("network/edit-tweet", views.edit_tweet, name="edit_tweet"),
]
