from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),

    # Главная страница React (index.html)
    path('', TemplateView.as_view(template_name='index.html')),

    # Маршрут для manifest.json
    path('manifest.json', TemplateView.as_view(template_name='manifest.json', content_type='application/json')),

    path('asset-manifest.json', TemplateView.as_view(template_name='asset-manifest.json', content_type='application/json')),

    # Маршрут для service-worker.js
    path('service-worker.js', TemplateView.as_view(template_name='service-worker.js', content_type='application/javascript')),
]
