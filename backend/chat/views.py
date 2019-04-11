from django.views.generic import TemplateView
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ModelViewSet

from chat.filters import MessageFilter
from chat.models import Message
from .serializers import MessageSerializer


class MainView(TemplateView):
    template_name = 'chat/index.html'


class MessageViewSet(ModelViewSet):
    serializer_class = MessageSerializer
    queryset = (Message.objects
                .select_related('author')
                .order_by('-created_at'))
    filterset_class = MessageFilter
    pagination_class = PageNumberPagination
