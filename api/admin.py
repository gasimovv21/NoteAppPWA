from django.contrib import admin
from .models import Note, SharedNote


class NoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'body', 'updated', 'created')
    search_fields = ('body',)
    list_filter = ('created', 'updated')
    ordering = ('-created',)


class SharedNoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'note', 'author', 'shared_id')
    search_fields = ('author',)
    list_filter = ('id', 'author')
    ordering = ('-id',)



admin.site.register(Note, NoteAdmin)
admin.site.register(SharedNote, SharedNoteAdmin)
