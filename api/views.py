from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Note, Subscription
from .serializers import NoteSerializer
from .utils import updateNote, getNoteDetail, deleteNote, getNotesList, createNote
from webpush import send_user_notification
from django.views.decorators.csrf import csrf_exempt
import json

@api_view(['GET'])
def getRoutes(request):
    routes = [
        {'Endpoint': '/notes/', 'method': 'GET', 'body': None, 'description': 'Returns an array of notes'},
        {'Endpoint': '/notes/id', 'method': 'GET', 'body': None, 'description': 'Returns a single note object'},
        {'Endpoint': '/notes/create/', 'method': 'POST', 'body': {'body': ""}, 'description': 'Creates new note'},
        {'Endpoint': '/notes/id/update/', 'method': 'PUT', 'body': {'body': ""}, 'description': 'Updates a note'},
        {'Endpoint': '/notes/id/delete/', 'method': 'DELETE', 'body': None, 'description': 'Deletes a note'},
    ]
    return Response(routes)

@api_view(['GET', 'POST'])
def getNotes(request):
    if request.method == 'GET':
        return getNotesList(request)
    elif request.method == 'POST':
        return createNote(request)

@api_view(['GET', 'PUT', 'DELETE'])
def getNote(request, pk):
    if request.method == 'GET':
        return getNoteDetail(request, pk)
    elif request.method == 'PUT':
        return updateNote(request, pk)
    elif request.method == 'DELETE':
        return deleteNote(request, pk)

@csrf_exempt
def subscribe(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        subscription_info = data.get('subscription')
        user = request.user

        if not user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

        # Сохраняем или обновляем данные подписки
        subscription, created = Subscription.objects.get_or_create(user=user)
        subscription.subscription_info = subscription_info
        subscription.save()

        return JsonResponse({'message': 'Subscription saved.'})

def send_push_notification(user, title, message):
    payload = {"head": title, "body": message}
    send_user_notification(user=user, payload=payload, ttl=1000)
