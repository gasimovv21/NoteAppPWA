import os

from pathlib import Path

from celery.schedules import timedelta

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-iciqweur=hp(xnyau)ev9d0@t)4orp)js8=t8qayvib05if0+3'

DEBUG = True

ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'api.apps.ApiConfig',

    'rest_framework',
    "corsheaders",
    'webpush',
    'webauthn',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',

    "corsheaders.middleware.CorsMiddleware",

    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'mynotes.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'frontend', 'build')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'mynotes.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'frontend', 'build', 'static'),  # Статические файлы, сгенерированные React
    os.path.join(BASE_DIR, 'frontend', 'build'),  # Путь к корневым файлам сборки, таким как manifest.json и logo192.png
]

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOW_ALL_ORIGINS = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}


WEBPUSH_SETTINGS = {
    "VAPID_PUBLIC_KEY": "BEjZrzG9pAo8KI1mt1fl0fZUYkL6cezhYhulAgisHa-zfrt1qNqYvSfqtHAWYGGY9wiT8ZUwhkIIHImstVuOmY4",
    "VAPID_PRIVATE_KEY": "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgIBGIY9jF4_GzAVQaWYl1p7NNtwNAiJ_FawiiVHDT-kChRANCAARI2a8xvaQKPCiNZrdX5dH2VGJC-nHs4WIbpQIIrB2vs367dajamL0n6rRwFmBhmPcIk_GVMIZCCByJrLVbjpmO",
    "VAPID_ADMIN_EMAIL": "gasimoweltun@gmail.com"
}

WEBAUTHN_RP_NAME = "TodoListApp"
WEBAUTHN_RP_ID = "127.0.0.1"  # Измените на домен, если разворачиваете на продакшене
WEBAUTHN_RP_ORIGIN = "http://127.0.0.1:8000"  # Замените на https://<ваш_домен> для продакшена


FIDO2_RP_NAME = "TodoListApp"  # Название вашего приложения
FIDO2_RP_ID = "localhost"      # Обычно домен приложения (например, example.com)


CELERY_BROKER_URL = 'redis://localhost:6379/0'  # URL для Redis-брокера
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

CELERY_BEAT_SCHEDULE = {
    'send-deadline-notifications': {
        'task': 'api.tasks.send_deadline_notifications',
        'schedule': timedelta(seconds=10),
    },
}
