from django.contrib.auth.models import AbstractUser
from django.db import models
from django.forms.models import model_to_dict

class User(AbstractUser):
    pass
    
    def __str__(self):
        return self.username


class Post(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="post_users")
    title = models.TextField()
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        objects = PostLike.objects.filter(post=self)
        likes = [model_to_dict(object) for object in objects]

        objects = Comment.objects.filter(user=self.user, post=self)
        comments = [model_to_dict(object) for object in objects]

        t = self.timestamp
        time = {"year": t.year, "month": t.month, "day": t.day, 
                "hour": t.hour, "minute": t.minute, "second": t.second, 
                "full": f"{t.year}/{t.month}/{t.day} {t.hour}:{t.minute}:{t.second}"
        }

        return {
            "id": self.id,
            "user": self.user.username,
            "title": self.title,
            "text": self.text,
            "timestamp": time,
            "likes": likes,
            "comments": comments
        }
    

class Comment(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    post = models.ForeignKey("Post", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    text = models.TextField()

    def serialize(self):
        return {
            "user": self.user,
            "post": self.text,
            "likes": CommentLike.objects.filter(user=self.user, comment=self),
            "timestamp": self.timestamp,
            "text": self.text
        }


class PostLike(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    post = models.ForeignKey("Post", null=True, on_delete=models.CASCADE)


class CommentLike(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    comment = models.ForeignKey("Comment", on_delete=models.CASCADE)