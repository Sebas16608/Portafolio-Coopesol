from rest_framework.views import  APIView
from rest_framework import status
from rest_framework.response import Response
from .serializers import ArticleSerializer, CategorySerializer
from .models import Article, Category
# Create your views here.

"""
CATEGORY API
"""
class CategoryView(APIView):
    def get(self, request, pk=None):
        if pk:
            try:
                categories = Category.objects.get(pk=pk)
                serializer = CategorySerializer(categories)
                return Response(serializer.data, {"mensaje": "Hizo un get list"}, status=status.HTTP_200_OK)
            except Category.DoesNotExist:
                return Response({"error": "Categoria no encontrada"}, status=status.HTTP_404_NOT_FOUND)
        else:
            categories = Category.objects.all()
            serializer = CategorySerializer(categories, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            categories = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({"error": "Categoria no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CategorySerializer(categories, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            categories = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({"error": "Categoria no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        categories.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
"""
ARTICLE API
"""

class ArticleView(APIView):
    def get(self, request, pk=None):
        if pk:
            try:
                articles = Article.objects.get(pk=pk)
                serializer = ArticleSerializer(articles)
                return Response(serializer.data)
            except Article.DoesNotExist:
                return Response({"error": "Articulo no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        else:
            articles = Article.objects.all()
            serializer = ArticleSerializer(articles, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, pk):
        try:
            articles = Article.objects.get(pk=pk)
        except Article.DoesNotExist:
            return Response({"error": "Articulo no encontrado"})

        serializer = ArticleSerializer(articles, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            articles = Article.objects.get(pk=pk)
        except Article.DoesNotExist:
            return Response({"error": "Articulo no encontrado"})

        articles.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
