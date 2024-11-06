# mynotes/celery.py
from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Указываем настройки Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mynotes.settings')
app = Celery('mynotes')

# Используем настройки Django
app.config_from_object('django.conf:settings', namespace='CELERY')

# Автоматически находит задачи в приложениях Django
app.autodiscover_tasks()

# Добавьте конфигурацию для Windows
app.conf.worker_pool = 'solo'
