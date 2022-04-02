from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.db import models


class User(AbstractUser):
    followers_list = models.ManyToManyField("Follower",
                                            related_name="followers_list")

    def __str__(self):
        return f"{self.username}"


class Post(models.Model):
    author = models.ForeignKey(User,
                               null=True,
                               on_delete=models.CASCADE,
                               related_name="author")
    post_body = models.CharField(max_length=500000)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.post_body[0:5]}"


class Follower(models.Model):
    user_follows = models.ForeignKey(User,
                                     null=True,
                                     on_delete=models.CASCADE,
                                     related_name="user_follows")
    user_followed = models.ForeignKey(User,
                                      null=True,
                                      on_delete=models.CASCADE,
                                      related_name="user_followed")


class Like(models.Model):
    user_liked = models.ForeignKey(User,
                                   null=True,
                                   on_delete=models.CASCADE,
                                   related_name="user")
    post_liked = models.ForeignKey(
        Post,
        null=True,
        on_delete=models.CASCADE,
        related_name="post",
    )

    def __str__(self):
        return f"User {self.user_liked.username} likes {self.post_liked.post_body[0:5]}"
