from rest_framework.response import Response
from .models import Note
from .serializers import NoteSerializer

def getNotesList(request):
    notes = Note.objects.filter(user=request.user).order_by('-updated')
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)

def getNoteDetail(request, pk):
    note = Note.objects.get(id=pk, user=request.user)
    serializer = NoteSerializer(note, many=False)
    return Response(serializer.data)

def createNote(request):
    data = request.data
    audio_file = request.FILES.get('audio_file')
    note = Note.objects.create(
        user=request.user,
        body=data.get('body', ''),
        audio_file=audio_file
    )
    serializer = NoteSerializer(note, many=False)
    return Response(serializer.data)

def updateNote(request, pk):
    data = request.data
    note = Note.objects.get(id=pk, user=request.user)
    note.body = data.get('body', note.body)
    
    if 'audio_file' in request.FILES:
        note.audio_file = request.FILES['audio_file']
    
    note.save()
    serializer = NoteSerializer(note, many=False)
    return Response(serializer.data)

def deleteNote(request, pk):
    note = Note.objects.get(id=pk, user=request.user)
    note.delete()
    return Response('Note was deleted!')
