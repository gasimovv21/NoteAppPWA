from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

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

    # Маршрут для index.html
    path('index.html', TemplateView.as_view(template_name='index.html', content_type='text/html')),

    # Маршрут для idb.min.js
    path('idb.min.js', TemplateView.as_view(template_name='idb.min.js', content_type='application/javascript')),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
