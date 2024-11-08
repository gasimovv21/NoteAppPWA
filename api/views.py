import base64
import json
import threading
import time

from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from webpush import send_user_notification
from typing import Optional
from .models import Note, SharedNote
from .serializers import NoteSerializer
from .utils import updateNote, getNoteDetail, deleteNote, getNotesList, createNote

from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, get_user_model

User = get_user_model()

@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        if username and password:
            user = User.objects.create_user(username=username, password=password)
            return JsonResponse({'status': 'User registered successfully'}, status=201)
        return JsonResponse({'error': 'Username and password are required'}, status=400)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            refresh = RefreshToken.for_user(user)
            return JsonResponse({'status': 'Login successful', 'token': str(refresh.access_token)}, status=200)
        return JsonResponse({'error': 'Invalid credentials'}, status=401)

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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    return JsonResponse({"username": user.username}, status=200)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_user_info_by_id(request, user_id):
    user = get_object_or_404(User, id=user_id)
    return JsonResponse({"username": user.username}, status=200)

@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def getNotes(request):
    if request.method == 'GET':
        return getNotesList(request)
    elif request.method == 'POST':
        return createNote(request)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def getNote(request, pk):
    try:
        note = Note.objects.get(id=pk, user=request.user)
    except Note.DoesNotExist:
        return Response({"error": "You do not have permission to access this note."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        return getNoteDetail(request, pk)
    elif request.method == 'PUT':
        return updateNote(request, pk)
    elif request.method == 'DELETE':
        return deleteNote(request, pk)

@api_view(['GET'])
@permission_classes([AllowAny])
def shared_note_view(request, shared_id):
    try:
        shared_note = get_object_or_404(SharedNote, shared_id=shared_id)
        note = shared_note.note
        serializer = NoteSerializer(note, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except (SharedNote.DoesNotExist, ValueError, base64.binascii.Error):
        return Response({"error": "Shared note not found or access denied."}, status=status.HTTP_404_NOT_FOUND)

def delete_shared_note_after_timeout(shared_id, timeout=30):
    time.sleep(timeout)
    try:
        shared_note = SharedNote.objects.get(shared_id=shared_id)
        shared_note.delete()
        print(f"Shared note with ID {shared_id} deleted after timeout.")
    except SharedNote.DoesNotExist:
        print(f"Shared note with ID {shared_id} already deleted or does not exist.")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_shared_link(request, pk):
    try:
        decoded_id = base64.urlsafe_b64decode(pk).decode("utf-8")
        note_id = int(decoded_id)
        note = get_object_or_404(Note, id=note_id, user=request.user)

        shared_note, created = SharedNote.objects.get_or_create(note=note, author=request.user)

        thread = threading.Thread(target=delete_shared_note_after_timeout, args=(shared_note.shared_id,))
        thread.start()

        shared_url = f"{request.build_absolute_uri('/')[:-1]}#/notes/shared/{shared_note.shared_id}"
        return Response({"shared_id": shared_note.shared_id, "url": shared_url}, status=status.HTTP_201_CREATED)

    except (ValueError, Note.DoesNotExist, base64.binascii.Error) as e:
        return Response({"error": "Invalid note or access denied."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_shared_note_as_new(request, shared_id):
    try:
        shared_note = SharedNote.objects.get(shared_id=shared_id)
        note_to_copy = shared_note.note

        new_note = Note.objects.create(
            body=note_to_copy.body,
            user=request.user
        )

        return Response({"message": "Note successfully saved."}, status=status.HTTP_201_CREATED)
    except SharedNote.DoesNotExist:
        return Response({"error": "Shared note not found or access denied."}, status=status.HTTP_404_NOT_FOUND)

@csrf_exempt
def subscribe(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        subscription_info = data.get('subscription')
        
        user = request.user
        if not user.is_authenticated:
            return JsonResponse({'error': 'User not authenticated'}, status=401)

        subscription, created = Subscription.objects.update_or_create(
            user=user,
            defaults={'subscription_info': subscription_info}
        )
        return JsonResponse({'message': 'Subscription saved.'})
    

def get_subscription_info(user) -> Optional[dict]:
    if hasattr(user, 'subscription') and user.subscription is not None:
        return user.subscription.subscription_info
    return None

def send_push_notification(user, title, message):
    try:
        subscription_info = user.subscription.subscription_info
    except AttributeError:
        print(f"Subscription not found for user {user.username}")
        return

    payload = {
        "title": title,
        "body": message,
        "icon": "/static/media/logo192.png",
        "url": "/#/notes",
    }

    send_user_notification(user=user, payload=payload, ttl=1000)
