import uuid

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import Index
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class Message(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
    )
    text = models.TextField(
        verbose_name=_('text'),
        max_length=300,
        null=False,
        blank=False,
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_('author'),
        on_delete=models.PROTECT,
        null=False,
        blank=False,
    )
    created_at = models.DateTimeField(
        verbose_name=_('created'),
        default=timezone.now
    )

    def __str__(self):
        return f'{self.author} {self.text[:30]}'

    class Meta:
        verbose_name = _('message')
        verbose_name_plural = _('messages')
        ordering = ('-created_at',)
        indexes = [
            Index(fields=['-created_at']),
        ]


class User(AbstractUser):
    def __str__(self):
        return self.username
