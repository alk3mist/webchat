from django.conf.urls import url, include
from rest_framework import routers

from chat import views

router = routers.DefaultRouter()
router.register(r'messages', views.MessageViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]
