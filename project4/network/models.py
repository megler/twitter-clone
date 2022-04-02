from django.contrib.auth.models import User, AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class User(AbstractUser):
    followers_list = models.ManyToManyField("Follower",
                                            related_name="followers_list")

    def __str__(self):
        return f"{self.username}"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    background_image = models.URLField(null=True)

    def __str__(self):
        return f"{self.user.first_name}"


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


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
