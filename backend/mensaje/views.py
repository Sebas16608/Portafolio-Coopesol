from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Mensaje
from .sreializers import MensajeSerializer
# Create your views here.
class MensajeView(APIView):
    def get(self, request, pk=None):
        if pk:
            try:
                mensajes = Mensaje.objects.get(pk=pk)
                serializer = MensajeSerializer(mensajes)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Mensaje.DoesNotExist:
                return Response({"error": "El mensaje no fue encontrado"}, status=status.HTTP_404_NOT_FOUND)
        else:
            mensajes = Mensaje.objects.all()
            serializer = MensajeSerializer(mensajes, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
    def post(self, request):
        serializer = MensajeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            mensajes = Mensaje.objects.get(pk=pk)
        except Mensaje.DoesNotExist:
            return Response({"error": "el mensaje no fue encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = MensajeSerializer(mensajes, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            mensajes = Mensaje.objects.get(pk=pk)
        except Mensaje.DoesNotExist:
            return Response({"error": "El mensaje no fue encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        mensajes.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
        
