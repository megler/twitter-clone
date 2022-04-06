from .models import User, Post


def sort_tweets(what_to_sort):
    """Pass in object call to Post model and sort entries by datestamp."""
    what_to_sort = what_to_sort.order_by("-date_created").all()
    return what_to_sort


def who_to_follow(request):
    users = User.objects.exclude(pk=request.user.id)
    return users
