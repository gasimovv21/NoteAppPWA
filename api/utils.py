from rest_framework.response import Response
from .models import Note
from .serializers import NoteSerializer

def getNotesList(request):
    notes = Note.objects.filter(user=request.user).order_by('-updated')  # Фильтр по пользователю
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)

def getNoteDetail(request, pk):
    note = Note.objects.get(id=pk, user=request.user)  # Проверка пользователя
    serializer = NoteSerializer(note, many=False)
    return Response(serializer.data)

def createNote(request):
    data = request.data
    note = Note.objects.create(
        user=request.user,  # Устанавливаем текущего пользователя как владельца
        body=data['body']
    )
    serializer = NoteSerializer(note, many=False)
    return Response(serializer.data)


def updateNote(request, pk):
    data = request.data
    note = Note.objects.get(id=pk, user=request.user)
    serializer = NoteSerializer(instance=note, data=data)

    if serializer.is_valid():
        serializer.save()

    # Оборачиваем результат в Response
    return Response(serializer.data)


def deleteNote(request, pk):
    note = Note.objects.get(id=pk, user=request.user)  # Проверка пользователя
    note.delete()
    return Response('Note was deleted!')
