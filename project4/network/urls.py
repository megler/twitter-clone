from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    # API
    path("network/index", views.all_tweets, name="all_tweets"),
    path("network/index/<int:pk>", views.user_profile, name="user_profile"),
]
