from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async

from chat.models import User, Message
from chat.serializers import MessageSerializer


class ChatConsumer(AsyncJsonWebsocketConsumer):
    group_name = 'default_chat'

    async def connect(self):
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive_json(self, content, **kwargs):
        message = await self.save_message(content)
        payload = MessageSerializer(message).data
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'chat.message',
                'payload': payload
            }
        )

    async def chat_message(self, event):
        await self.send_json(event)

    @database_sync_to_async
    def save_message(self, content):
        author, created = User.objects.get_or_create(username=content['username'])
        message = Message.objects.create(
            text=content['message'],
            author=author
        )
        return message
