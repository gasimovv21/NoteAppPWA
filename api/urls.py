from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),


    path('', views.getRoutes, name="routes"),
    path('notes/', views.getNotes, name="notes"),
    path('notes/<str:pk>/', views.getNote, name="note"),
    path('notes/shared/create/<str:pk>/', views.create_shared_link, name="create_shared_link"),
    path('notes/shared/<str:shared_id>/', views.shared_note_view, name='shared_note'),
    path('notes/shared/save/<str:shared_id>/', views.save_shared_note_as_new, name="save_shared_note_as_new"),

    path('webauthn/register/options', views.webauthn_register_options, name='webauthn_register_options'),
    path('webauthn/register/verify', views.webauthn_register_verify, name='webauthn_register_verify'),
    path('webauthn/authenticate/options', views.webauthn_authenticate_options, name='webauthn_authenticate_options'),
    path('webauthn/authenticate/verify', views.webauthn_authenticate_verify, name='webauthn_authenticate_verify'),

    path('subscribe/', views.subscribe, name='subscribe'),
]
