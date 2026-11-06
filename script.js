const products = [
  {
    id: 1,
    name: 'AirFlex Pro',
    category: 'fashion',
    tag: 'Bestseller',
    price: 599,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Smart Watch X9',
    category: 'electronics',
    tag: 'Nowe',
    price: 899,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Lampa Halo',
    category: 'home',
    tag: 'Promocja',
    price: 249,
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Torba Everyday',
    category: 'fashion',
    tag: 'Limit',
    price: 329,
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
  },
  {
    id: 5,
    name: 'Laptop Aero 14',
    category: 'electronics',
    tag: 'Top',
    price: 3499,
    image:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    rating: 5.0,
  },
  {
    id: 6,
    name: 'Zestaw do domu',
    category: 'home',
    tag: 'Nowość',
    price: 499,
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
    rating: 4.8,
  },
  {
    id: 7,
    name: 'Koszulka Urban',
    category: 'fashion',
    tag: 'Popularne',
    price: 149,
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    rating: 4.6,
  },
  {
    id: 8,
    name: 'Słuchawki Pulse',
    category: 'electronics',
    tag: 'Popularne',
    price: 429,
    image:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    rating: 4.9,
  },
];

const cart = [];
const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const cartPanel = document.getElementById('cartPanel');
const overlay = document.getElementById('overlay');
const filterButtons = document.querySelectorAll('.filter-btn');

function formatPrice(value) {
  return `${value.toLocaleString('pl-PL')} zł`;
}

function renderProducts(filter = 'all') {
  const visibleProducts = filter === 'all' ? products : products.filter((product) => product.category === filter);

  productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image">
            <span class="product-tag">${product.tag}</span>
            <img src="${product.image}" alt="${product.name}" />
          </div>
          <div class="product-body">
            <div class="product-meta">
              <span>${product.category}</span>
              <span>★ ${product.rating}</span>
            </div>
            <h3>${product.name}</h3>
            <div class="product-price-row">
              <span class="price">${formatPrice(product.price)}</span>
              <button class="add-to-cart" data-id="${product.id}">Dodaj</button>
            </div>
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.id)));
  });
}

function updateCart() {
  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Koszyk jest pusty.</p>';
    cartCount.textContent = '0';
    cartTotal.textContent = '0 zł';
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id);
    total += product.price * item.quantity;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="cart-item-info">
        <h4>${product.name}</h4>
        <span>${formatPrice(product.price)}</span>
        <div class="cart-item-actions">
          <div class="qty-control">
            <button data-action="decrease" data-id="${product.id}">-</button>
            <span>${item.quantity}</span>
            <button data-action="increase" data-id="${product.id}">+</button>
          </div>
          <strong>${formatPrice(product.price * item.quantity)}</strong>
        </div>
      </div>
    `;
    cartItems.appendChild(itemEl);
  });

  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0).toString();
  cartTotal.textContent = formatPrice(total);

  document.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => changeQuantity(Number(button.dataset.id), button.dataset.action));
  });
}

function addToCart(productId) {
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  updateCart();
  openCart();
}

function changeQuantity(productId, action) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;

  if (action === 'increase') {
    item.quantity += 1;
  } else if (action === 'decrease') {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      const index = cart.findIndex((entry) => entry.id === productId);
      cart.splice(index, 1);
    }
  }

  updateCart();
}

function openCart() {
  cartPanel.classList.add('open');
  overlay.classList.add('visible');
}

function closeCart() {
  cartPanel.classList.remove('open');
  overlay.classList.remove('visible');
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
    renderProducts(button.dataset.filter);
  });
});

document.getElementById('cartToggle').addEventListener('click', () => {
  if (cartPanel.classList.contains('open')) {
    closeCart();
  } else {
    openCart();
  }
});

document.getElementById('closeCart').addEventListener('click', closeCart);
document.getElementById('overlay').addEventListener('click', closeCart);

renderProducts();
updateCart();
