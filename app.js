/**
 * Tabacaria 3D Premium - Main JavaScript File
 * Handles product catalog, filtering, modal interactions, and form validation
 */

// Product data embedded from JSON
const PRODUCTS = [
  {
    "id": 1,
    "name": "Porta-Cigarros Vintage",
    "category": "Porta-Cigarros",
    "price": "R$ 199,90",
    "shortDescription": "Elegância clássica para seus cigarros premium.",
    "description": "Porta-cigarros em impressão 3D com acabamento em cobre escovado, comporta até 10 unidades king size. Design inspirado em arte déco, perfeito para ocasiões especiais.",
    "specs": {
      "Dimensões": "110 x 70 x 20 mm",
      "Material": "PLA Pro + pintura cobre",
      "Peso": "85 g",
      "Tempo de produção": "6 h"
    },
    "colors": ["#B87333", "#FFD700", "#704214"],
    "images": ["https://via.placeholder.com/400x400/B87333/FFFFFF?text=Porta-Cigarros", "https://via.placeholder.com/400x400/FFD700/000000?text=Vintage+Style"]
  },
  {
    "id": 2,
    "name": "Cinzeiro Hexagonal Luxo",
    "category": "Cinzeiros",
    "price": "R$ 149,90",
    "shortDescription": "Design geométrico com linhas elegantes.",
    "description": "Cinzeiro em formato hexagonal, bordas chanfradas e base antiderrapante. Impressão 3D em PLA reforçado, acabamento fosco preto e detalhes em dourado para um visual sofisticado.",
    "specs": {
      "Dimensões": "120 x 120 x 30 mm",
      "Material": "PLA Pro",
      "Peso": "120 g",
      "Tempo de produção": "5 h"
    },
    "colors": ["#1A1A1A", "#FFD700"],
    "images": ["https://via.placeholder.com/400x400/1A1A1A/FFD700?text=Cinzeiro+Hex", "https://via.placeholder.com/400x400/FFD700/000000?text=Luxury+Design"]
  },
  {
    "id": 3,
    "name": "Isqueiro Sleeve Premium",
    "category": "Acessórios",
    "price": "R$ 79,90",
    "shortDescription": "Proteção e estilo para seu isqueiro.",
    "description": "Capa protetora para isqueiro padrão, impressa em TPU flexível com textura de couro. Detalhes em relevo e opção de personalização de iniciais.",
    "specs": {
      "Dimensões": "70 x 30 x 15 mm",
      "Material": "TPU",
      "Peso": "25 g",
      "Tempo de produção": "1.5 h"
    },
    "colors": ["#4F3C2C", "#B87333"],
    "images": ["https://via.placeholder.com/400x400/4F3C2C/FFFFFF?text=Isqueiro+Sleeve"]
  }
];

// Global variables
let filteredProducts = [...PRODUCTS];
let currentModal = null;

/**
 * DOM Content Loaded - Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  initializeApp();
});

/**
 * Initialize all app functionality
 */
function initializeApp() {
  console.log('Initializing app...');
  setupCurrentYear();
  setupNavigation();
  renderProducts();
  setupFilters();
  setupContactForm();
  setupModal();
  console.log('App initialized successfully');
}

/**
 * Set current year in footer
 */
function setupCurrentYear() {
  const yearElement = document.getElementById('ano');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Setup smooth scrolling navigation
 */
function setupNavigation() {
  console.log('Setting up navigation...');

  // Handle "Ver Catálogo" button
  const catalogButton = document.querySelector('[data-scroll-target="#produtos"]');
  if (catalogButton) {
    catalogButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Catalog button clicked');
      const target = document.getElementById('produtos');
      if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight || 80;
        const targetPosition = target.offsetTop - headerHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  }

  // Handle all navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        console.log('Nav link clicked:', href);
        
        const target = document.querySelector(href);
        if (target) {
          const headerHeight = document.querySelector('.header').offsetHeight || 80;
          const targetPosition = target.offsetTop - headerHeight - 20;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

/**
 * Render products in the grid
 */
function renderProducts() {
  console.log('Rendering products...', filteredProducts.length);
  const grid = document.getElementById('produtos-grid');
  
  if (!grid) {
    console.error('Products grid element not found');
    return;
  }
  
  if (filteredProducts.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <p style="color: var(--color-text-secondary); font-size: var(--font-size-lg);">Nenhum produto encontrado.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredProducts.map(product => `
    <article class="product-card" data-product-id="${product.id}" tabindex="0" role="button" aria-label="Ver detalhes de ${product.name}">
      <div class="product-card__image">
        <img src="${product.images[0]}" alt="${product.name}" loading="lazy" />
      </div>
      <div class="product-card__content">
        <h3 class="product-card__title">${product.name}</h3>
        <p class="product-card__description">${product.shortDescription}</p>
        <p class="product-card__price">${product.price}</p>
        <button class="btn btn--primary btn--sm" onclick="openProductModal(${product.id}); event.stopPropagation();">
          Ver detalhes
        </button>
      </div>
    </article>
  `).join('');

  // Add click events to product cards
  setupProductCardEvents();
  console.log('Products rendered successfully');
}

/**
 * Setup product card click events
 */
function setupProductCardEvents() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't trigger if clicking on button
      if (e.target.tagName === 'BUTTON') {
        return;
      }
      
      const productId = parseInt(this.getAttribute('data-product-id'));
      if (productId) {
        console.log('Product card clicked:', productId);
        openProductModal(productId);
      }
    });

    // Keyboard support
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const productId = parseInt(this.getAttribute('data-product-id'));
        if (productId) {
          openProductModal(productId);
        }
      }
    });
  });
}

/**
 * Setup product filters (category dropdown and search)
 */
function setupFilters() {
  console.log('Setting up filters...');
  const categorySelect = document.getElementById('categoria');
  const searchInput = document.getElementById('pesquisa');

  if (!categorySelect || !searchInput) {
    console.error('Filter elements not found');
    return;
  }

  // Clear and populate category dropdown
  categorySelect.innerHTML = '';
  const categories = ['Todas as categorias', ...new Set(PRODUCTS.map(p => p.category))];
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category === 'Todas as categorias' ? '' : category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  // Add event listeners for filtering
  categorySelect.addEventListener('change', function() {
    console.log('Category changed to:', this.value);
    filterProducts();
  });

  searchInput.addEventListener('input', function() {
    console.log('Search input:', this.value);
    filterProducts();
  });

  console.log('Filters set up successfully');
}

/**
 * Filter products based on category and search term
 */
function filterProducts() {
  const categorySelect = document.getElementById('categoria');
  const searchInput = document.getElementById('pesquisa');

  if (!categorySelect || !searchInput) {
    return;
  }

  const categoryFilter = categorySelect.value.toLowerCase();
  const searchFilter = searchInput.value.toLowerCase().trim();

  filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = !categoryFilter || product.category.toLowerCase() === categoryFilter;
    const matchesSearch = !searchFilter || 
      product.name.toLowerCase().includes(searchFilter) ||
      product.shortDescription.toLowerCase().includes(searchFilter) ||
      product.description.toLowerCase().includes(searchFilter);

    return matchesCategory && matchesSearch;
  });

  console.log('Filtered products:', filteredProducts.length);
  renderProducts();
}

/**
 * Setup product modal functionality
 */
function setupModal() {
  console.log('Setting up modal...');
  const modal = document.getElementById('produto-modal');
  
  if (!modal) {
    console.error('Modal element not found');
    return;
  }

  // Close modal when clicking overlay or close button
  modal.addEventListener('click', function(e) {
    if (e.target === modal || e.target.hasAttribute('data-close-modal')) {
      closeProductModal();
    }
  });

  // Close modal on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && currentModal) {
      closeProductModal();
    }
  });

  // Add to cart button
  const addToCartBtn = document.getElementById('add-to-cart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      const productName = document.getElementById('modal-title').textContent;
      console.log(`Produto "${productName}" adicionado ao carrinho!`);
      alert(`Produto "${productName}" adicionado ao carrinho!`);
    });
  }

  console.log('Modal set up successfully');
}

/**
 * Open product modal with details
 */
window.openProductModal = function(productId) {
  console.log('Opening modal for product:', productId);
  
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) {
    console.error('Product not found:', productId);
    return;
  }

  const modal = document.getElementById('produto-modal');
  if (!modal) {
    console.error('Modal not found');
    return;
  }
  
  // Populate modal content
  document.getElementById('modal-title').textContent = product.name;
  document.getElementById('modal-description').textContent = product.description;
  document.getElementById('modal-price').textContent = product.price;

  // Gallery images
  const gallery = document.getElementById('modal-gallery');
  gallery.innerHTML = product.images.map((image, index) => `
    <img src="${image}" alt="${product.name} - Imagem ${index + 1}" loading="lazy" />
  `).join('');

  // Specifications table
  const specsTable = document.getElementById('modal-specs');
  specsTable.innerHTML = `
    <tbody>
      ${Object.entries(product.specs).map(([key, value]) => `
        <tr>
          <th>${key}</th>
          <td>${value}</td>
        </tr>
      `).join('')}
    </tbody>
  `;

  // Color swatches
  const colorsDiv = document.getElementById('modal-colors');
  colorsDiv.innerHTML = product.colors.map(color => `
    <div class="color-swatch" 
         style="background-color: ${color}" 
         title="Cor: ${color}" 
         tabindex="0" 
         role="button" 
         aria-label="Cor ${color}">
    </div>
  `).join('');

  // Show modal
  modal.classList.remove('hidden');
  currentModal = modal;

  // Focus the close button
  const closeButton = modal.querySelector('.modal__close');
  if (closeButton) {
    setTimeout(() => closeButton.focus(), 100);
  }

  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  
  console.log('Modal opened successfully');
};

/**
 * Close product modal
 */
window.closeProductModal = function() {
  console.log('Closing modal...');
  const modal = document.getElementById('produto-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
  
  currentModal = null;
  document.body.style.overflow = '';
  
  console.log('Modal closed');
};

/**
 * Setup contact form validation and submission
 */
function setupContactForm() {
  console.log('Setting up contact form...');
  const form = document.getElementById('contato-form');
  const nomeInput = document.getElementById('nome');
  const emailInput = document.getElementById('email');
  const mensagemInput = document.getElementById('mensagem');

  if (!form || !nomeInput || !emailInput || !mensagemInput) {
    console.error('Contact form elements not found');
    return;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log('Contact form submitted');

    // Clear previous errors
    clearValidationErrors();

    let isValid = true;

    // Validate nome
    const nomeValue = nomeInput.value.trim();
    if (!nomeValue) {
      showValidationError(nomeInput, 'Nome é obrigatório');
      isValid = false;
    } else if (nomeValue.length < 2) {
      showValidationError(nomeInput, 'Nome deve ter pelo menos 2 caracteres');
      isValid = false;
    }

    // Validate email
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue) {
      showValidationError(emailInput, 'Email é obrigatório');
      isValid = false;
    } else if (!emailRegex.test(emailValue)) {
      showValidationError(emailInput, 'Email deve ter um formato válido');
      isValid = false;
    }

    // Validate mensagem
    const mensagemValue = mensagemInput.value.trim();
    if (!mensagemValue) {
      showValidationError(mensagemInput, 'Mensagem é obrigatória');
      isValid = false;
    } else if (mensagemValue.length < 10) {
      showValidationError(mensagemInput, 'Mensagem deve ter pelo menos 10 caracteres');
      isValid = false;
    }

    if (isValid) {
      alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      form.reset();
      console.log('Form submitted successfully:', {
        nome: nomeValue,
        email: emailValue,
        mensagem: mensagemValue
      });
    } else {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });

  console.log('Contact form set up successfully');
}

/**
 * Show validation error for form field
 */
function showValidationError(input, message) {
  input.setAttribute('aria-invalid', 'true');
  input.style.borderColor = '#FF5459';
  
  // Remove existing error
  const existingError = input.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Create error message
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  input.parentNode.appendChild(errorElement);
}

/**
 * Clear all validation errors
 */
function clearValidationErrors() {
  const invalidInputs = document.querySelectorAll('[aria-invalid="true"]');
  invalidInputs.forEach(input => {
    input.removeAttribute('aria-invalid');
    input.style.borderColor = '';
    
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  });
}

// Debug: Log when script loads
console.log('Tabacaria 3D JavaScript loaded successfully');
