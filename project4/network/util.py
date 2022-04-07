from .models import User, Post


def sort_tweets(what_to_sort):
    """Pass in object call to Post model and sort entries by datestamp."""
    what_to_sort = what_to_sort.order_by("-date_created").all()
    return what_to_sort


def who_to_follow(request):
    users = User.objects.exclude(pk=request.user.id)
    return users


def follow_nums(user_id):
    # Get all users to create iterable
    follows = User.objects.all()
    user_followed_by_count = 0
    user_following_count = 0
    is_following = False

    # Loop over users
    for user in follows:
        # get all followers for all users
        user_following = user.profile.followers.all()
        people_following_user = user.followed_by.all()

        # Who the user is following
        if user == user_id and user_following.count() > 0:
            user_following_count = user_following.count()
            is_following = True
        # Who is following the user
        if user == user_id and people_following_user.count() > 0:
            user_followed_by_count = people_following_user.count()

    return (user_followed_by_count, user_following_count, is_following)
