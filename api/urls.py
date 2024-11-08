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

    path('user/', views.get_user_info, name='user_info'),
    path('user/<int:user_id>/', views.get_user_info_by_id, name='user_info_by_id'),

]
