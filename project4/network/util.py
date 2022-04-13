from .models import User, Post, Like
from django.core.paginator import Paginator
import random


def sort_tweets(what_to_sort):
    """Pass in object call to Post model and sort entries by datestamp."""
    what_to_sort = what_to_sort.order_by("-date_created").all()
    return what_to_sort


def who_to_follow(request):
    """Get all users, remove signed in user by ID, shuffle the list and return it"""
    ids = [i.id for i in User.objects.all()]
    if request.user.id in ids:
        ids.remove(request.user.id)
    random.shuffle(ids)
    shuffled = [User.objects.get(id=i) for i in ids]
    return shuffled


def confirm_user_follows(request, user_id):
    """Returns if user is following a specific person"""

    follows = User.objects.all()
    for user in follows:
        if request.user == user:
            people_following_user = user.followed_by.filter(user_id=user_id)
            if people_following_user:
                is_following = True
            else:
                is_following = False
    return is_following


def follow_nums(user_id):
    """Returns who the user is following, who is following the user and is_following boolean"""
    # Get all users to create iterable
    follows = User.objects.all()
    user_followed_by_count = 0
    user_following_count = 0

    # Loop over users
    for user in follows:
        # get all followers for all users
        user_following = user.profile.followers.all()
        people_following_user = user.followed_by.all()

        # Who the user is following
        if user == user_id and user_following.count() > 0:
            user_following_count = user_following.count()

        # Who is following the user
        if user == user_id and people_following_user.count() > 0:
            user_followed_by_count = people_following_user.count()

    return (user_followed_by_count, user_following_count)


def tweet_count(user_id):
    """Returns number of tweets a user has"""
    posts = Post.objects.filter(author__pk=user_id)
    return posts.count()


def paginate(request, items):
    """Django paginate functions. Limits tweets to 10 per page"""
    paginator = Paginator(items, 10)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)
    return page_obj


def like_count():
    """Counts the number of likes for each tweet"""
    tweets = Post.objects.all()
    likes = {}
    for tweet in tweets:
        likes[tweet.id] = Like.objects.filter(post_liked=tweet.id).count()
    return likes
