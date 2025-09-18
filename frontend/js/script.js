// Configuración de la API
const API_BASE_URL = 'http://localhost:8000/portafolio';

// Elementos del DOM globales
const loadingSpinner = `
    <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2 text-muted">Cargando contenido...</p>
    </div>
`;

const errorMessage = `
    <div class="alert alert-danger text-center">
        <h4>Error de conexión</h4>
        <p>No se pudo conectar con el servidor. Por favor, intente nuevamente.</p>
        <button onclick="window.location.reload()" class="btn btn-sm btn-outline-danger">Reintentar</button>
    </div>
`;

// Utilidades
function formatDate(dateString) {
    try {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch (error) {
        return 'Fecha no disponible';
    }
}

function getImageUrl(imagePath) {
    if (!imagePath || imagePath === 'null' || imagePath === 'undefined' || imagePath === '') {
        return 'https://via.placeholder.com/400x300/1a4f8b/ffffff?text=Imagen+no+disponible';
    }
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    if (imagePath.startsWith('/')) {
        return `http://localhost:8000${imagePath}`;
    }
    
    return `http://localhost:8000/media/${imagePath}`;
}

function handleApiError(error, containerId = null) {
    console.error('Error API:', error);
    if (containerId && document.getElementById(containerId)) {
        document.getElementById(containerId).innerHTML = errorMessage;
    }
    return null;
}

// Funciones para Categorías
async function loadFeaturedCategories() {
    try {
        const container = document.getElementById('featured-categories');
        if (!container) return;
        
        container.innerHTML = loadingSpinner;
        
        const response = await fetch(`${API_BASE_URL}/category/`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const categories = await response.json();
        
        // Verificar si la respuesta es un array
        if (!Array.isArray(categories)) {
            throw new Error('Formato de respuesta inválido para categorías');
        }
        
        const featuredCategories = categories.filter(cat => cat.featured === true);
        
        if (featuredCategories.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-4">
                    <p class="text-muted">No hay categorías destacadas disponibles.</p>
                    <p class="text-muted small">Las categorías destacadas deben tener featured=true en la API.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = featuredCategories.slice(0, 3).map(category => `
            <div class="col-md-4 mb-4">
                <div class="category-card card h-100 shadow-sm">
                    <img src="${getImageUrl(category.image)}" 
                         class="category-image card-img-top" 
                         alt="${category.name || 'Categoría'}"
                         style="height: 350px; object-fit: cover;"
                         onerror="this.src='https://via.placeholder.com/400x350/1a4f8b/ffffff?text=${encodeURIComponent(category.name || 'Categoría')}'">
                    <div class="card-body d-flex flex-column">
                        <h3 class="h4 card-title">${category.name || 'Sin nombre'}</h3>
                        <div class="mt-auto pt-3">
                            <a href="categorias-detalle.html?id=${category.id}" class="btn btn-primary w-100 py-2">
                                Ver artículos
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading featured categories:', error);
        handleApiError(error, 'featured-categories');
    }
}

async function loadAllCategories() {
    try {
        const container = document.getElementById('all-categories');
        if (!container) return;
        
        container.innerHTML = loadingSpinner;
        
        const response = await fetch(`${API_BASE_URL}/category/`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const categories = await response.json();
        
        if (!Array.isArray(categories)) {
            throw new Error('Formato de respuesta inválido para categorías');
        }
        
        if (categories.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-muted">No hay categorías disponibles.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = categories.map(category => `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="category-card card h-100 shadow-sm">
                    <img src="${getImageUrl(category.image)}" 
                         class="category-image card-img-top" 
                         alt="${category.name || 'Categoría'}"
                         style="height: 350px; object-fit: cover;"
                         onerror="this.src='https://via.placeholder.com/400x350/1a4f8b/ffffff?text=${encodeURIComponent(category.name || 'Categoría')}'">
                    <div class="card-body d-flex flex-column">
                        <h3 class="h4 card-title">${category.name || 'Sin nombre'}</h3>
                        ${category.featured ? '<span class="badge bg-warning mb-2 fs-6">⭐ Destacada</span>' : ''}
                        <div class="mt-auto pt-3">
                            <a href="categorias-detalle.html?id=${category.id}" class="btn btn-outline-primary btn-lg">
                                Explorar artículos
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading all categories:', error);
        handleApiError(error, 'all-categories');
    }
}

async function loadCategoryDetail(categoryId) {
    try {
        console.log('Cargando categoría con ID:', categoryId);
        
        const response = await fetch(`${API_BASE_URL}/category/${categoryId}/`);
        
        if (!response.ok) {
            console.log('Categoría no encontrada o error en el servidor');
            return;
        }
        
        const category = await response.json();
        
        // Verificar si los elementos existen antes de modificarlos
        const categoryTitle = document.getElementById('category-title');
        const categoryDescription = document.getElementById('category-description');
        
        if (categoryTitle && category.name) {
            categoryTitle.textContent = category.name;
        }
        
        if (categoryDescription && category.name) {
            categoryDescription.textContent = 
                `Explora todos nuestros artículos en la categoría ${category.name}`;
        }
        
        if (category.name) {
            document.title = `${category.name} - Portafolio Banco`;
        }
        
    } catch (error) {
        console.log('Error loading category detail (manejado silenciosamente):', error);
        // No mostrar mensaje de error para no interrumpir el flujo
    }
}

// Funciones para Artículos
async function loadRecentArticles() {
    try {
        const container = document.getElementById('recent-articles');
        if (!container) return;
        
        container.innerHTML = loadingSpinner;
        
        const response = await fetch(`${API_BASE_URL}/articulo/`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const articles = await response.json();
        
        if (!Array.isArray(articles)) {
            throw new Error('Formato de respuesta inválido para artículos');
        }
        
        // Filtrar artículos activos (status no false)
        const activeArticles = articles.filter(article => article.status !== false);
        
        // Ordenar por fecha y tomar los 3 más recientes
        const recentArticles = activeArticles
            .sort((a, b) => new Date(b.created) - new Date(a.created))
            .slice(0, 3);
        
        if (recentArticles.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-4">
                    <p class="text-muted">No hay artículos recientes disponibles.</p>
                    <p class="text-muted small">Los artículos deben tener status=true en la API.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = recentArticles.map(article => `
            <div class="col-md-4 mb-4">
                <div class="article-card card h-100 shadow-sm">
                    <img src="${getImageUrl(article.image)}" 
                         class="article-image card-img-top" 
                         alt="${article.title || 'Artículo'}"
                         style="height: 350px; object-fit: cover;"
                         onerror="this.src='https://via.placeholder.com/400x350/3b7dd6/ffffff?text=${encodeURIComponent(article.title || 'Artículo')}'">
                    <div class="card-body d-flex flex-column">
                        <h3 class="h4 card-title">${article.title || 'Sin título'}</h3>
                        <p class="article-meta text-muted fs-6">
                            <i class="bi bi-calendar"></i> ${formatDate(article.created)}
                        </p>
                        <p class="article-excerpt flex-grow-1 fs-5">${article.introduccion || 'Sin descripción disponible.'}</p>
                        <div class="mt-auto pt-3">
                            <a href="detalle-articulo.html?id=${article.id}" class="btn btn-primary btn-lg w-100">
                                Leer más
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading recent articles:', error);
        handleApiError(error, 'recent-articles');
    }
}

async function loadAllArticles() {
    try {
        const container = document.getElementById('all-articles');
        if (!container) return;
        
        container.innerHTML = loadingSpinner;
        
        const response = await fetch(`${API_BASE_URL}/articulo/`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const articles = await response.json();
        
        if (!Array.isArray(articles)) {
            throw new Error('Formato de respuesta inválido para artículos');
        }
        
        // Filtrar artículos activos
        const activeArticles = articles.filter(article => article.status !== false);
        
        if (activeArticles.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-muted">No hay artículos disponibles.</p>
                    <p class="text-muted small">Los artículos deben tener status=true en la API.</p>
                </div>
            `;
            return;
        }
        
        // Ordenar por fecha (más recientes primero)
        activeArticles.sort((a, b) => new Date(b.created) - new Date(a.created));
        
        container.innerHTML = activeArticles.map(article => `
            <div class="col-lg-6 mb-4">
                <div class="article-card card h-100 shadow-sm">
                    <img src="${getImageUrl(article.image)}" 
                         class="article-image card-img-top" 
                         alt="${article.title || 'Artículo'}"
                         style="height: 350px; object-fit: cover;"
                         onerror="this.src='https://via.placeholder.com/400x350/3b7dd6/ffffff?text=${encodeURIComponent(article.title || 'Artículo')}'">
                    <div class="card-body d-flex flex-column">
                        <h3 class="h4 card-title">${article.title || 'Sin título'}</h3>
                        <p class="article-meta text-muted fs-6">
                            <i class="bi bi-calendar"></i> ${formatDate(article.created)}
                        </p>
                        <p class="article-excerpt flex-grow-1 fs-5">${article.introduccion || 'Sin descripción disponible.'}</p>
                        <div class="d-flex justify-content-between align-items-center mt-auto pt-3">
                            <a href="detalle-articulo.html?id=${article.id}" class="btn btn-outline-primary btn-lg">
                                Leer más
                            </a>
                            <span class="badge bg-primary fs-6">
                                ${article.categories && Array.isArray(article.categories) ? article.categories.length : 0} categorías
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading all articles:', error);
        handleApiError(error, 'all-articles');
    }
}

async function loadArticlesByCategory(categoryId) {
    try {
        const container = document.getElementById('articles-container');
        const noArticlesMessage = document.getElementById('no-articles-message');
        
        if (!container) return;
        
        container.innerHTML = loadingSpinner;
        if (noArticlesMessage) noArticlesMessage.classList.add('d-none');
        
        const response = await fetch(`${API_BASE_URL}/articulo/`);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const articles = await response.json();
        
        if (!Array.isArray(articles)) {
            throw new Error('Formato de respuesta inválido para artículos');
        }
        
        // Filtrar artículos por categoría y que estén activos
        const filteredArticles = articles.filter(article => {
            const isActive = article.status !== false;
            const inCategory = article.categories && article.categories.some(cat => 
                cat.id === parseInt(categoryId) || cat === parseInt(categoryId)
            );
            return isActive && inCategory;
        });
        
        if (filteredArticles.length === 0) {
            container.innerHTML = '';
            if (noArticlesMessage) noArticlesMessage.classList.remove('d-none');
            return;
        }
        
        // Ordenar por fecha (más recientes primero)
        filteredArticles.sort((a, b) => new Date(b.created) - new Date(a.created));
        
        container.innerHTML = filteredArticles.map(article => `
            <div class="col-lg-6 mb-4">
                <div class="article-card card h-100 shadow-sm">
                    <img src="${getImageUrl(article.image)}" 
                         class="article-image card-img-top" 
                         alt="${article.title || 'Artículo'}"
                         style="height: 350px; object-fit: cover;"
                         onerror="this.src='https://via.placeholder.com/400x350/3b7dd6/ffffff?text=${encodeURIComponent(article.title || 'Artículo')}'">
                    <div class="card-body d-flex flex-column">
                        <h3 class="h4 card-title">${article.title || 'Sin título'}</h3>
                        <p class="article-meta text-muted fs-6">
                            <i class="bi bi-calendar"></i> ${formatDate(article.created)}
                        </p>
                        <p class="article-excerpt flex-grow-1 fs-5">${article.introduccion || 'Sin descripción disponible.'}</p>
                        <div class="mt-auto pt-3">
                            <a href="detalle-articulo.html?id=${article.id}" class="btn btn-primary btn-lg w-100">
                                Ver detalles
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading articles by category:', error);
        handleApiError(error, 'articles-container');
    }
}

async function loadArticleDetail(articleId) {
    try {
        const container = document.getElementById('article-detail-content');
        if (!container) return;
        
        const response = await fetch(`${API_BASE_URL}/articulo/${articleId}/`);
        if (!response.ok) throw new Error('Artículo no encontrado');
        
        const article = await response.json();
        
        if (article.status === false) {
            container.innerHTML = `
                <div class="alert alert-warning text-center">
                    <h4>Artículo no disponible</h4>
                    <p>Este artículo no está disponible en este momento.</p>
                    <a href="articulos.html" class="btn btn-sm btn-outline-warning">Volver a artículos</a>
                </div>
            `;
            return;
        }
        
        const imageUrl = getImageUrl(article.image);
        const categoryNames = article.categories && Array.isArray(article.categories) 
            ? article.categories.map(cat => typeof cat === 'object' ? cat.name : `Categoría ${cat}`).join(', ')
            : 'Sin categorías';
        
        container.innerHTML = `
            <img src="${imageUrl}" 
                 class="article-detail-image card-img-top" 
                 alt="${article.title || 'Artículo'}"
                 style="max-height: 400px; object-fit: cover;"
                 onerror="this.src='https://via.placeholder.com/800x400/3b7dd6/ffffff?text=${encodeURIComponent(article.title || 'Artículo')}'">
            <div class="card-body">
                <h1 class="article-detail-title display-5">${article.title || 'Sin título'}</h1>
                
                <div class="article-detail-meta mb-4">
                    <div class="d-flex flex-wrap gap-3">
                        <span class="text-muted fs-5">
                            <i class="bi bi-calendar"></i> Publicado el ${formatDate(article.created)}
                        </span>
                        <span class="text-muted fs-5">
                            <i class="bi bi-tags"></i> Categorías: ${categoryNames}
                        </span>
                    </div>
                </div>
                
                ${article.introduccion ? `
                <div class="article-intro lead mb-4 p-3 bg-light rounded fs-4">
                    ${article.introduccion}
                </div>
                ` : ''}
                
                <div class="article-detail-body fs-5">
                    ${article.body ? article.body.split('\n').map(paragraph => 
                        paragraph.trim() ? `<p>${paragraph}</p>` : ''
                    ).join('') : '<p class="text-muted">No hay contenido disponible para este artículo.</p>'}
                </div>
            </div>
        `;
        
        document.title = `${article.title || 'Artículo'} - Portafolio Banco`;
        
    } catch (error) {
        console.error('Error loading article detail:', error);
        handleApiError(error, 'article-detail-content');
    }
}

// Cargar categorías para filtros
async function loadCategoriesForFilter() {
    try {
        const filterSelect = document.getElementById('category-filter');
        if (!filterSelect) return;
        
        const response = await fetch(`${API_BASE_URL}/category/`);
        if (!response.ok) return;
        
        const categories = await response.json();
        
        if (Array.isArray(categories)) {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name || `Categoría ${category.id}`;
                filterSelect.appendChild(option);
            });
        }
        
    } catch (error) {
        console.error('Error loading categories for filter:', error);
    }
}

// Filtrado de artículos
function filterArticlesByCategory(categoryId) {
    if (categoryId) {
        window.location.href = `categorias-detalle.html?id=${categoryId}`;
    } else {
        window.location.href = 'articulos.html';
    }
}

// Inicialización con manejo de errores
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Añadir estilos para transiciones suaves
        const style = document.createElement('style');
        style.textContent = `
            .category-card, .article-card {
                transition: all 0.3s ease;
                border-radius: 16px;
                overflow: hidden;
            }
            .category-card:hover, .article-card:hover {
                transform: translateY(-8px) scale(1.02);
                box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
            }
            .category-image, .article-image {
                transition: transform 0.5s ease;
            }
            .category-card:hover .category-image,
            .article-card:hover .article-image {
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);
        
    } catch (error) {
        console.error('Error in initialization:', error);
    }
});

// Manejar errores no capturados
window.addEventListener('error', function(e) {
    console.error('Error global:', e.error);
});

// Exportar funciones para uso global
window.API = {
    loadFeaturedCategories,
    loadAllCategories,
    loadCategoryDetail,
    loadRecentArticles,
    loadAllArticles,
    loadArticlesByCategory,
    loadArticleDetail,
    loadCategoriesForFilter,
    filterArticlesByCategory
};

// Función para el menú hamburguesa
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.navbar ul');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.navbar a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.navbar') && !event.target.closest('.hamburger')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
}

// Inicialización con manejo de errores
document.addEventListener('DOMContentLoaded', function() {
    try {
        initMobileMenu();
        
        // Añadir estilos para transiciones suaves
        const style = document.createElement('style');
        style.textContent = `
            .fade-in {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            .fade-in.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* Animación hamburguesa */
            .hamburger.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            .hamburger.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        `;
        document.head.appendChild(style);
        
        // Hacer visible los elementos con fade-in
        setTimeout(() => {
            document.querySelectorAll('.fade-in').forEach(element => {
                element.classList.add('visible');
            });
        }, 100);
        
    } catch (error) {
        console.error('Error in initialization:', error);
    }
});