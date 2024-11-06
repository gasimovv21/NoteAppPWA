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
        user=request.user,
        body=data['body'],
        deadline=data.get('deadline')  # Устанавливаем дедлайн, если он передан
    )
    serializer = NoteSerializer(note, many=False)
    return Response(serializer.data)



def updateNote(request, pk):
    data = request.data
    note = Note.objects.get(id=pk, user=request.user)

    # Обновляем текст заметки
    note.body = data['body']

    # Обновляем или удаляем дедлайн в зависимости от переданных данных
    if 'deadline' in data:
        note.deadline = data['deadline'] if data['deadline'] else None
    else:
        note.deadline = None  # Удаляем дедлайн, если он не передан

    note.save()  # Сохраняем изменения
    serializer = NoteSerializer(note, many=False)
    return Response(serializer.data)


def deleteNote(request, pk):
    note = Note.objects.get(id=pk, user=request.user)  # Проверка пользователя
    note.delete()
    return Response('Note was deleted!')
