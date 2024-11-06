# api/tasks.py
from celery import shared_task
from django.utils import timezone
from .models import Note, Subscription
from .views import send_push_notification

@shared_task
def send_deadline_notifications():
    print("Запущена задача send_deadline_notifications")
    current_time = timezone.now()
    notes_with_deadline = Note.objects.filter(deadline__gte=current_time)

    if not notes_with_deadline:
        print("Нет заметок с дедлайном")

    for note in notes_with_deadline:
        user = note.user
        subscriptions = Subscription.objects.filter(user=user)
        message = f"Привет {user.username}! Не забудь про свою заметку '{note.body[:20]}' срок {note.deadline}!"
        
        if subscriptions.exists():
            for subscription in subscriptions:
                print(f"Отправляем уведомление для пользователя {user.username}")
                send_push_notification(user, "Напоминание", message)
        else:
            print(f"Нет подписок для пользователя {user.username}")

