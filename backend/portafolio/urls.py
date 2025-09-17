from django.urls import  path, include
from .views import ArticleView, CategoryView

urlpatterns = [
        path("articulo/", ArticleView.as_view(), name="article-list"),
        path("articulo/<int:pk>/", ArticleView.as_view(), name="article-detail"),
        path("category/", CategoryView.as_view(), name="category-list"),
        path("category/<int:pk>/", CategoryView.as_view(), name="category-detail"),
        ]
