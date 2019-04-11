from django_filters import rest_framework as filters

from chat.models import Message


class MessageFilter(filters.FilterSet):
    created_after = filters.IsoDateTimeFilter(
        field_name='created_at',
        lookup_expr='gt'
    )

    created_before = filters.IsoDateTimeFilter(
        field_name='created_at',
        lookup_expr='lt'
    )

    ordering = filters.OrderingFilter(
        fields=[
            ('author__name', 'author'),
            ('created_at', 'created_at'),
        ]
    )

    class Meta:
        model = Message
        fields = [
            'id',
            'created_after',
            'created_before',
            'ordering'
        ]
