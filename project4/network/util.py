from .models import User, Post


def sort_tweets(what_to_sort):
    """Pass in object call to Post model and sort entries by datestamp."""
    what_to_sort = what_to_sort.order_by("-date_created").all()
    return what_to_sort


def send_tweet(request):
    user = User.objects.get(pk=request.user.id)
    tweet_body = request.POST["tweet_body"]
    new_tweet = Post.objects.create(author=user, post_body=tweet_body)
    new_tweet.save()
