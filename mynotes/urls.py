from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),

    path('', TemplateView.as_view(template_name='index.html')),

    path('manifest.json', TemplateView.as_view(template_name='manifest.json', content_type='application/json')),

    path('asset-manifest.json', TemplateView.as_view(template_name='asset-manifest.json', content_type='application/json')),

    path('service-worker.js', TemplateView.as_view(template_name='service-worker.js', content_type='application/javascript')),

    path('index.html', TemplateView.as_view(template_name='index.html', content_type='text/html')),

    path('idb.min.js', TemplateView.as_view(template_name='idb.min.js', content_type='application/javascript')),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
