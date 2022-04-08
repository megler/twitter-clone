import json
from webbrowser import get
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from .util import *
from .models import User, Post, Like, Profile


def index(request):
    """When visiting homepage, show all tweets"""

    all_tweets = Post.objects.all()
    tweets = sort_tweets(all_tweets)

    return render(request, "network/index.html", {
        "posts": tweets,
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


def user_profile(request, pk):
    user_profile_id = User.objects.get(pk=pk)
    specific_tweets = Post.objects.filter(author__id=pk)
    tweets = sort_tweets(specific_tweets)
    num_tweets = tweet_count(pk)

    # get a suggested follower list and limit to 10
    if request.user.is_authenticated:
        other_users = who_to_follow(request)[:10]

    # get followers/following count from util.py
    user_following_count, user_followed_by_count, is_following = follow_nums(
        user_profile_id)

    return render(
        request,
        "network/profile.html",
        {
            "tweet_count": num_tweets,
            "is_following": is_following,
            "user_follows": user_following_count,
            "user_followed_by": user_followed_by_count,
            "user_profile_id": user_profile_id,
            "posts": tweets,
            "follow_suggestions": other_users,
        },
    )


# Functionality


def follow(request, id):
    if request.method == "POST":
        to_follow = Profile.objects.get(user=id)
        to_follow.followers.add(request.user)
        to_follow.save()
        return user_profile(request, id)


def unfollow(request, id):
    if request.method == "POST":
        to_unfollow = Profile.objects.get(user=id)
        to_unfollow.followers.remove(request.user)
        to_unfollow.save()
        return user_profile(request, id)


def send_tweet(request, pk):
    if request.method == "POST":
        user = User.objects.get(pk=request.user.id)
        tweet_body = request.POST["tweet_body"]
        new_tweet = Post.objects.create(author=user, post_body=tweet_body)
        new_tweet.save()
        return user_profile(request, pk)


# def user_following(request, pk):
#     user_is_following = Profile.objects.filter(followers__id=pk)

#     return render(
#         request,
#         "network/following.html",
#         {"user_is_following": user_is_following},
#     )
