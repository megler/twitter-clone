import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from .util import *
from .models import User, Post, Like, Profile


def index(request):
    """When visiting homepage, if user auth, then show user's tweets else
    show all tweets"""

    if request.user.is_authenticated:
        if request.method == "POST":
            send_tweet(request)
            return all_tweets(request)
        else:
            pk = request.user.id
            tweets = Post.objects.filter(id=pk)
            tweets = sort_tweets(tweets)
            user = User.objects.get(pk=pk)
            other_users = who_to_follow(request)[:10]

            return render(
                request,
                "network/index.html",
                {
                    "posts": tweets,
                    "user": user,
                    "follow_suggestions": other_users
                },
            )
    if not request.user.is_authenticated:
        return all_tweets(request)


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
            return render(
                request,
                "network/login.html",
                {"message": "Invalid username and/or password."},
            )
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        first_name = request.POST["first_name"]
        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html",
                          {"message": "Passwords must match."})

        # Attempt to create new user
        try:
            user = User.objects.create_user(username,
                                            email,
                                            password,
                                            first_name=first_name)
            user.save()
            # Save userinfo record
            user = User.objects.get(pk=user.id)
            user.profile.background_image = request.POST["background_img"]
            user.save()
        except IntegrityError:
            return render(request, "network/register.html",
                          {"message": "Username already taken."})
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def all_tweets(request):
    tweets = Post.objects.all()
    tweets = sort_tweets(tweets)
    if request.user.is_authenticated:
        other_users = who_to_follow(request)[:10]
    else:
        other_users = ""

    return render(
        request,
        "network/index.html",
        {
            "posts": tweets,
            "follow_suggestions": other_users
        },
    )
