from django.urls import path
from .views import MensajeView

urlpatterns = [
    path("", MensajeView.as_view(), name="mensajes-list"),
    path("<int:pk>/", MensajeView.as_view(), name="mensajes-detail"),
]