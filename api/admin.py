from django.contrib import admin
from .models import Note, Subscription


class NoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'body', 'updated', 'created')
    search_fields = ('body',)
    list_filter = ('created', 'updated')
    ordering = ('-created',)


class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'subscription_info')
    search_fields = ('user__username',)
    list_filter = ('user',)


admin.site.register(Note, NoteAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
