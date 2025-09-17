from django.db import models

# Create your models here.
class Category(models.Model):
    name = models.CharField(None)
    image = models.ImageField(blank=True, null=True, upload_to="")
    slug = models.SlugField(unique=True, max_length=255)
    featured = models.BooleanField(default=True)
    created = models.DateTimeField(auto_now_add=True)
    update = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

# Articulo 
class Article(models.Model):
    title = models.CharField(max_length=100)
    introduccion = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)
    image = models.ImageField(upload_to='')
    body = models.TextField()
    url = models.URLField(max_length=255, blank=True)
    categories = models.ManyToManyField(Category)
    created = models.DateTimeField(auto_now_add=True)
    update = models.DateTimeField(auto_now=True)
    status = models.BooleanField(default=True)

    #definir la URL “canónica” o principal de una instancia específica de ese modelo.
    def get_absolute_url(self):
        return reverse('post', kwargs={'slug': self.slug})


    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = 'Article'
        verbose_name_plural = 'Articles'