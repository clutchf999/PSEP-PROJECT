/**
 * FoodExpress - Online Food Ordering System
 * Full Frontend SPA Client
 * SRS & SDLC Project Implementation
 * Prepared by: Adithya Kumaresan
 */

// Application State
const state = {
  token: localStorage.getItem('fe_token') || null,
  user: JSON.parse(localStorage.getItem('fe_user') || 'null'),
  cart: JSON.parse(localStorage.getItem('fe_cart') || '[]'),
  currentRestaurant: null,
  selectedCategory: 'All',
  searchQuery: '',
  selectedRating: 5,
  activeReviewOrderId: null
};

// API Base
const API_BASE = '/api';

// Headers Helper
function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (state.token) {
    headers['Authorization'] = `Bearer ${state.token}`;
  }
  return headers;
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  updateUserUI();
  fetchRestaurants();
  updateCartBadge();

  // If user was logged in previously as owner or admin, navigate to their dashboard
  if (state.user) {
    if (state.user.Role === 'Restaurant Owner') {
      navigate('owner');
    } else if (state.user.Role === 'Admin') {
      navigate('admin');
    }
  }
});

// Toast System
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? 'circle-check' : (type === 'error' ? 'circle-exclamation' : 'circle-info');
  toast.innerHTML = `<i class="fa-solid fa-${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================
// NAVIGATION SYSTEM
// ==========================================
function navigate(viewName) {
  // Hide all views
  const views = ['view-home', 'view-restaurant-detail', 'view-orders', 'view-owner', 'view-admin'];
  views.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // Reset active classes
  document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));

  if (viewName === 'home') {
    document.getElementById('view-home').style.display = 'block';
    document.getElementById('nav-browse').classList.add('active');
    fetchRestaurants();
  } else if (viewName === 'restaurant-detail') {
    document.getElementById('view-restaurant-detail').style.display = 'block';
  } else if (viewName === 'orders') {
    if (!state.user) {
      openAuthModal('login');
      showToast('Please login to view your orders.', 'error');
      return;
    }
    document.getElementById('view-orders').style.display = 'block';
    document.getElementById('nav-orders').classList.add('active');
    loadCustomerOrders();
  } else if (viewName === 'owner') {
    if (!state.user || state.user.Role !== 'Restaurant Owner') {
      quickLogin('owner@bistro.com', 'Restaurant Owner');
      return;
    }
    document.getElementById('view-owner').style.display = 'block';
    document.getElementById('nav-owner').classList.add('active');
    loadOwnerDashboard();
  } else if (viewName === 'admin') {
    if (!state.user || state.user.Role !== 'Admin') {
      quickLogin('admin@foodapp.com', 'Admin');
      return;
    }
    document.getElementById('view-admin').style.display = 'block';
    document.getElementById('nav-admin').classList.add('active');
    loadAdminDashboard();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// AUTHENTICATION & QUICK DEMO LOGINS
// ==========================================
async function quickLogin(email, role) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email: email, Password: 'password123' })
    });
    const data = await res.json();
    if (data.success) {
      setAuthSession(data.token, data.user);
      showToast(`Switched persona to ${data.user.Name} (${data.user.Role})`, 'success');
      
      if (role === 'Restaurant Owner') {
        navigate('owner');
      } else if (role === 'Admin') {
        navigate('admin');
      } else {
        navigate('home');
      }
    } else {
      showToast(data.message, 'error');
    }
  } catch (err) {
    showToast('Login failed: ' + err.message, 'error');
  }
}

function setAuthSession(token, user) {
  state.token = token;
  state.user = user;
  localStorage.setItem('fe_token', token);
  localStorage.setItem('fe_user', JSON.stringify(user));
  updateUserUI();
}

function logout() {
  state.token = null;
  state.user = null;
  localStorage.removeItem('fe_token');
  localStorage.removeItem('fe_user');
  updateUserUI();
  navigate('home');
  showToast('Logged out successfully.', 'info');
}

function updateUserUI() {
  const authButtons = document.getElementById('auth-buttons');
  const userMenu = document.getElementById('user-profile-menu');
  const navOrders = document.getElementById('nav-orders');
  const navOwner = document.getElementById('nav-owner');
  const navAdmin = document.getElementById('nav-admin');

  if (state.user) {
    authButtons.style.display = 'none';
    userMenu.style.display = 'flex';
    document.getElementById('user-display-name').textContent = state.user.Name.split(' ')[0];
    document.getElementById('user-display-role').textContent = state.user.Role;
    document.getElementById('user-avatar').textContent = state.user.Name.charAt(0).toUpperCase();

    // Show appropriate navigation items based on role
    navOrders.style.display = state.user.Role === 'Customer' ? 'flex' : 'none';
    navOwner.style.display = state.user.Role === 'Restaurant Owner' ? 'flex' : 'none';
    navAdmin.style.display = state.user.Role === 'Admin' ? 'flex' : 'none';
  } else {
    authButtons.style.display = 'flex';
    userMenu.style.display = 'none';
    navOrders.style.display = 'none';
    navOwner.style.display = 'none';
    navAdmin.style.display = 'none';
  }
}

function openAuthModal(mode = 'login') {
  document.getElementById('auth-modal').style.display = 'flex';
  toggleAuthTab(mode);
}

function closeAuthModal() {
  document.getElementById('auth-modal').style.display = 'none';
}

function toggleAuthTab(mode) {
  const isLogin = mode === 'login';
  document.getElementById('tab-login').classList.toggle('active', isLogin);
  document.getElementById('tab-register').classList.toggle('active', !isLogin);
  document.getElementById('auth-modal-title').textContent = isLogin ? 'Welcome Back!' : 'Create New Account';
  document.getElementById('reg-name-group').style.display = isLogin ? 'none' : 'block';
  document.getElementById('reg-phone-group').style.display = isLogin ? 'none' : 'block';
  document.getElementById('reg-role-group').style.display = isLogin ? 'none' : 'block';
  document.getElementById('auth-submit-btn').textContent = isLogin ? 'Login to Account' : 'Register Account';
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const isLogin = document.getElementById('tab-login').classList.contains('active');
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-password').value;

  try {
    if (isLogin) {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email, Password: password })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setAuthSession(data.token, data.user);
      closeAuthModal();
      showToast(`Welcome back, ${data.user.Name}!`, 'success');
      if (data.user.Role === 'Restaurant Owner') navigate('owner');
      else if (data.user.Role === 'Admin') navigate('admin');
      else navigate('home');
    } else {
      const name = document.getElementById('auth-name').value;
      const phone = document.getElementById('auth-phone').value;
      const role = document.getElementById('auth-role').value;
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Name: name, Email: email, Phone: phone, Password: password, Role: role })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setAuthSession(data.token, data.user);
      closeAuthModal();
      showToast('Registration successful! Welcome.', 'success');
      if (data.user.Role === 'Restaurant Owner') navigate('owner');
      else if (data.user.Role === 'Admin') navigate('admin');
      else navigate('home');
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ==========================================
// RESTAURANT BROWSING (FR2)
// ==========================================
async function fetchRestaurants() {
  try {
    let url = `${API_BASE}/restaurants?search=${encodeURIComponent(state.searchQuery)}`;
    if (state.selectedCategory && state.selectedCategory !== 'All') {
      url += `&category=${encodeURIComponent(state.selectedCategory)}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    if (data.success) {
      renderRestaurants(data.restaurants);
      document.getElementById('restaurant-count-text').textContent = `Showing ${data.count} restaurants`;
    }
  } catch (err) {
    showToast('Failed to load restaurants: ' + err.message, 'error');
  }
}

function renderRestaurants(restaurants) {
  const grid = document.getElementById('restaurant-grid');
  if (!restaurants || restaurants.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: white; border-radius: 12px;">
        <i class="fa-solid fa-utensils" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 12px;"></i>
        <h3>No restaurants found</h3>
        <p class="text-muted">Try adjusting your search query or category filter.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = restaurants.map(r => `
    <div class="restaurant-card" onclick="openRestaurant(${r.Restaurant_ID})">
      <div class="card-image-wrap">
        <img src="${r.Image_URL}" alt="${r.Name}">
        <span class="badge-rating"><i class="fa-solid fa-star"></i> ${r.Rating}</span>
      </div>
      <div class="card-content">
        <div>
          <h3 class="card-title">${r.Name}</h3>
          <p class="card-cuisine">${r.Cuisine}</p>
        </div>
        <div class="card-footer-info">
          <span><i class="fa-regular fa-clock"></i> ${r.Delivery_Time}</span>
          <span>₹${r.Cost_For_Two} for two</span>
        </div>
      </div>
    </div>
  `).join('');
}

let searchDebounceTimeout = null;
function handleSearch() {
  clearTimeout(searchDebounceTimeout);
  searchDebounceTimeout = setTimeout(() => {
    state.searchQuery = document.getElementById('restaurant-search').value.trim();
    fetchRestaurants();
  }, 300);
}

function applyFilters() {
  state.searchQuery = document.getElementById('restaurant-search').value.trim();
  fetchRestaurants();
}

function filterCategory(cat, btnElement) {
  document.querySelectorAll('.cat-pill').forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');
  state.selectedCategory = cat;
  fetchRestaurants();
}

// ==========================================
// RESTAURANT DETAIL & MENU (FR2)
// ==========================================
async function openRestaurant(id) {
  try {
    const res = await fetch(`${API_BASE}/restaurants/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    const r = data.restaurant;
    state.currentRestaurant = r;

    // Header banner
    document.getElementById('rest-detail-header').innerHTML = `
      <img src="${r.Image_URL}" alt="${r.Name}" class="rest-banner-img">
      <div class="rest-banner-info">
        <h1>${r.Name}</h1>
        <p class="text-muted"><i class="fa-solid fa-location-dot"></i> ${r.Address}</p>
        <div class="rest-meta">
          <span class="badge-rating"><i class="fa-solid fa-star"></i> ${r.Rating}</span>
          <span><i class="fa-solid fa-utensils"></i> ${r.Cuisine}</span>
          <span><i class="fa-regular fa-clock"></i> ${r.Delivery_Time}</span>
          <span>₹${r.Cost_For_Two} for two</span>
        </div>
      </div>
    `;

    document.getElementById('rest-menu-count').textContent = `${r.menu.length} items available`;

    // Render Menu Items
    const menuGrid = document.getElementById('menu-items-grid');
    if (r.menu.length === 0) {
      menuGrid.innerHTML = `<p class="text-muted">No items available currently.</p>`;
    } else {
      menuGrid.innerHTML = r.menu.map(item => `
        <div class="menu-card">
          <div class="menu-card-details">
            <span class="menu-category-tag">${item.Category}</span>
            <h4 class="menu-card-title">${item.Name}</h4>
            <p class="menu-card-desc">${item.Description || ''}</p>
            <div class="menu-card-price">₹${item.Price}</div>
          </div>
          <div class="menu-card-action">
            <img src="${item.Image_URL || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}" class="menu-card-img" alt="${item.Name}">
            ${item.Availability 
              ? `<button class="btn-add-cart" onclick="addToCart(${item.Item_ID}, '${escapeHtml(item.Name)}', ${item.Price}, ${r.Restaurant_ID}, '${escapeHtml(r.Name)}')">
                  <i class="fa-solid fa-plus"></i> ADD
                 </button>`
              : `<button class="btn-add-cart" disabled>Out of Stock</button>`
            }
          </div>
        </div>
      `).join('');
    }

    // Render Reviews
    const reviewsList = document.getElementById('restaurant-reviews-list');
    if (!r.reviews || r.reviews.length === 0) {
      reviewsList.innerHTML = `<p class="text-muted">No reviews yet. Be the first to order and review!</p>`;
    } else {
      reviewsList.innerHTML = r.reviews.map(rev => `
        <div class="review-item">
          <div class="review-header">
            <span class="review-author"><i class="fa-solid fa-circle-user"></i> ${rev.Customer_Name}</span>
            <span class="review-stars">${'★'.repeat(rev.Rating)}${'☆'.repeat(5 - rev.Rating)}</span>
          </div>
          <p class="review-text">"${escapeHtml(rev.Comment)}"</p>
          <small class="text-muted">${new Date(rev.Created_At).toLocaleDateString()}</small>
        </div>
      `).join('');
    }

    navigate('restaurant-detail');
  } catch (err) {
    showToast('Failed to open restaurant: ' + err.message, 'error');
  }
}

function escapeHtml(str) {
  return (str || '').replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

// ==========================================
// CART & ORDER MANAGEMENT (FR4)
// ==========================================
function addToCart(itemId, name, price, restId, restName) {
  // If cart has items from another restaurant, confirm with user
  if (state.cart.length > 0 && state.cart[0].Restaurant_ID !== restId) {
    const confirmChange = confirm(
      `Your cart contains items from "${state.cart[0].Restaurant_Name}". Do you want to discard your cart and start a new order from "${restName}"?`
    );
    if (!confirmChange) return;
    state.cart = [];
  }

  const existing = state.cart.find(i => i.Item_ID === itemId);
  if (existing) {
    existing.Quantity += 1;
  } else {
    state.cart.push({
      Item_ID: itemId,
      Name: name,
      Price: price,
      Quantity: 1,
      Restaurant_ID: restId,
      Restaurant_Name: restName
    });
  }

  saveCart();
  updateCartBadge();
  showToast(`Added "${name}" to cart!`, 'success');
}

function updateCartQty(itemId, delta) {
  const item = state.cart.find(i => i.Item_ID === itemId);
  if (!item) return;

  item.Quantity += delta;
  if (item.Quantity <= 0) {
    state.cart = state.cart.filter(i => i.Item_ID !== itemId);
  }
  saveCart();
  updateCartBadge();
  renderCartDrawer();
}

function saveCart() {
  localStorage.setItem('fe_cart', JSON.stringify(state.cart));
}

function updateCartBadge() {
  const totalCount = state.cart.reduce((sum, i) => sum + i.Quantity, 0);
  document.getElementById('cart-count').textContent = totalCount;
}

function openCart() {
  renderCartDrawer();
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-drawer-overlay').style.display = 'block';
}

function closeCart() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-drawer-overlay').style.display = 'none';
}

function renderCartDrawer() {
  const container = document.getElementById('cart-items-container');
  const footer = document.getElementById('cart-footer');

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 40px 10px; color: #94a3b8;">
        <i class="fa-solid fa-cart-shopping" style="font-size: 3.5rem; margin-bottom: 12px;"></i>
        <h4>Your Cart is Empty</h4>
        <p class="text-muted">Explore our curated menus and add mouthwatering dishes to get started.</p>
      </div>
    `;
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  container.innerHTML = state.cart.map(item => `
    <div class="cart-item-row">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.Name}</div>
        <div class="cart-item-price">₹${item.Price} each</div>
      </div>
      <div class="cart-qty-ctrl">
        <button class="qty-btn" onclick="updateCartQty(${item.Item_ID}, -1)">-</button>
        <span>${item.Quantity}</span>
        <button class="qty-btn" onclick="updateCartQty(${item.Item_ID}, 1)">+</button>
      </div>
      <div style="font-weight: 700; min-width: 60px; text-align: right;">
        ₹${item.Price * item.Quantity}
      </div>
    </div>
  `).join('');

  // Bill calculations
  const subtotal = state.cart.reduce((sum, i) => sum + (i.Price * i.Quantity), 0);
  const deliveryFee = 30;
  const taxes = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryFee + taxes;

  document.getElementById('cart-subtotal').textContent = `₹${subtotal}`;
  document.getElementById('cart-delivery-fee').textContent = `₹${deliveryFee}`;
  document.getElementById('cart-tax').textContent = `₹${taxes}`;
  document.getElementById('cart-grand-total').textContent = `₹${grandTotal}`;
}

// ==========================================
// PAYMENT GATEWAY & ORDER PLACEMENT (FR4, FR5)
// ==========================================
function proceedToPayment() {
  if (state.cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }

  if (!state.user) {
    closeCart();
    openAuthModal('login');
    showToast('Please login to place your order.', 'error');
    return;
  }

  const address = document.getElementById('checkout-address').value.trim();
  if (!address) {
    showToast('Please enter a delivery address.', 'error');
    return;
  }

  const subtotal = state.cart.reduce((sum, i) => sum + (i.Price * i.Quantity), 0);
  const grandTotal = subtotal + 30 + Math.round(subtotal * 0.05);

  document.getElementById('pay-modal-amount').textContent = `₹${grandTotal}`;
  document.getElementById('payment-modal').style.display = 'flex';
}

function closePaymentModal() {
  document.getElementById('payment-modal').style.display = 'none';
}

function switchPayTab(tab, btn) {
  document.querySelectorAll('.pay-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.getElementById('pay-tab-upi').style.display = tab === 'upi' ? 'block' : 'none';
  document.getElementById('pay-tab-card').style.display = tab === 'card' ? 'block' : 'none';
  document.getElementById('pay-tab-netbanking').style.display = tab === 'netbanking' ? 'block' : 'none';
}

async function executePayment() {
  const confirmBtn = document.getElementById('confirm-pay-btn');
  confirmBtn.disabled = true;
  confirmBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing Payment...`;

  const address = document.getElementById('checkout-address').value.trim();
  const subtotal = state.cart.reduce((sum, i) => sum + (i.Price * i.Quantity), 0);
  const grandTotal = subtotal + 30 + Math.round(subtotal * 0.05);
  const restId = state.cart[0].Restaurant_ID;

  // Determine chosen payment method
  let chosenMethod = 'UPI';
  if (document.getElementById('pay-tab-card').style.display === 'block') chosenMethod = 'Card';
  if (document.getElementById('pay-tab-netbanking').style.display === 'block') chosenMethod = 'NetBanking';

  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        Restaurant_ID: restId,
        Delivery_Address: address,
        Total_Amount: grandTotal,
        Payment_Method: chosenMethod,
        Items: state.cart.map(i => ({
          Item_ID: i.Item_ID,
          Name: i.Name,
          Quantity: i.Quantity,
          Price: i.Price
        }))
      })
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    // Clear cart
    state.cart = [];
    saveCart();
    updateCartBadge();
    closePaymentModal();
    closeCart();

    showToast('Payment Successful! Order Confirmed 🎉', 'success');

    // Open live order tracking modal
    openTrackingModal(data.order.Order_ID);
  } catch (err) {
    showToast('Payment / Order placement failed: ' + err.message, 'error');
  } finally {
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = `<i class="fa-solid fa-lock"></i> Authorize & Pay`;
  }
}

// ==========================================
// ORDER TRACKING (FR6)
// ==========================================
async function openTrackingModal(orderId) {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}`, { headers: getHeaders() });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    const order = data.order;
    renderTrackingModal(order);
    document.getElementById('tracking-modal').style.display = 'flex';
  } catch (err) {
    showToast('Unable to track order: ' + err.message, 'error');
  }
}

function closeTrackingModal() {
  document.getElementById('tracking-modal').style.display = 'none';
  if (state.user && state.user.Role === 'Customer') {
    navigate('orders');
  }
}

function renderTrackingModal(order) {
  const statuses = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentIdx = statuses.indexOf(order.Status);

  const container = document.getElementById('tracking-modal-content');
  container.innerHTML = `
    <div style="background:#f8fafc; padding:16px; border-radius:10px; margin-bottom:16px; border:1px solid #e2e8f0;">
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <strong>Order #${order.Order_ID}</strong>
        <span class="badge badge-prep">${order.Status}</span>
      </div>
      <div style="font-size:0.85rem; color:#64748b;">
        <div><strong>Restaurant:</strong> ${order.Restaurant_Name}</div>
        <div><strong>Total Paid:</strong> ₹${order.Total_Amount} (${order.Payment ? order.Payment.Payment_Method : 'Paid'})</div>
        <div><strong>Deliver to:</strong> ${order.Delivery_Address}</div>
      </div>
    </div>

    <!-- Stepper -->
    <div class="tracking-stepper">
      <div class="track-step ${currentIdx >= 0 ? (currentIdx === 0 ? 'active' : 'done') : ''}">
        <div class="track-icon"><i class="fa-solid fa-receipt"></i></div>
        <div class="track-info">
          <h4>Order Placed & Confirmed</h4>
          <p>Restaurant received your food order</p>
        </div>
      </div>

      <div class="track-step ${currentIdx >= 1 ? (currentIdx === 1 ? 'active' : 'done') : ''}">
        <div class="track-icon"><i class="fa-solid fa-fire-burner"></i></div>
        <div class="track-info">
          <h4>Preparing Delicious Meal</h4>
          <p>Chefs are cooking fresh ingredients</p>
        </div>
      </div>

      <div class="track-step ${currentIdx >= 2 ? (currentIdx === 2 ? 'active' : 'done') : ''}">
        <div class="track-icon"><i class="fa-solid fa-motorcycle"></i></div>
        <div class="track-info">
          <h4>Out for Delivery</h4>
          <p>Delivery partner is speeding to your address</p>
        </div>
      </div>

      <div class="track-step ${currentIdx >= 3 ? 'done' : ''}">
        <div class="track-icon"><i class="fa-solid fa-circle-check"></i></div>
        <div class="track-info">
          <h4>Delivered</h4>
          <p>Enjoy your meal! Please rate your experience</p>
        </div>
      </div>
    </div>

    ${order.Status === 'Delivered' && !order.Review ? `
      <div style="margin-top:16px; text-align:center;">
        <button class="btn btn-primary btn-block" onclick="closeTrackingModal(); openReviewModal(${order.Order_ID});">
          <i class="fa-solid fa-star"></i> Leave Rating & Review (FR7)
        </button>
      </div>
    ` : ''}
  `;
}

// ==========================================
// RATINGS & REVIEWS (FR7)
// ==========================================
function openReviewModal(orderId) {
  state.activeReviewOrderId = orderId;
  state.selectedRating = 5;
  setStarRating(5);
  document.getElementById('review-comment-input').value = '';
  document.getElementById('review-modal').style.display = 'flex';
}

function closeReviewModal() {
  document.getElementById('review-modal').style.display = 'none';
}

function setStarRating(num) {
  state.selectedRating = num;
  const stars = document.querySelectorAll('#star-selector .star');
  stars.forEach((star, index) => {
    star.classList.toggle('active', index < num);
  });
  document.getElementById('rating-number-text').textContent = `${num}.0 / 5`;
}

async function submitReview() {
  const comment = document.getElementById('review-comment-input').value.trim();
  if (!comment) {
    showToast('Please enter your review feedback.', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/orders/${state.activeReviewOrderId}/review`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ Rating: state.selectedRating, Comment: comment })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    closeReviewModal();
    showToast('Review submitted successfully! Thank you.', 'success');
    loadCustomerOrders();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ==========================================
// CUSTOMER ORDERS VIEW
// ==========================================
async function loadCustomerOrders() {
  try {
    const res = await fetch(`${API_BASE}/orders`, { headers: getHeaders() });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    const container = document.getElementById('customer-orders-list');
    if (!data.orders || data.orders.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding: 48px; background: white; border-radius: 12px;">
          <i class="fa-solid fa-clock-rotate-left" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 12px;"></i>
          <h3>No past orders yet</h3>
          <p class="text-muted">Place your first order to track it live!</p>
          <button class="btn btn-primary mt-3" onclick="navigate('home')">Browse Restaurants</button>
        </div>
      `;
      return;
    }

    container.innerHTML = data.orders.map(order => {
      const statusClass = order.Status === 'Delivered' ? 'badge-delivered' : (order.Status === 'Cancelled' ? 'badge-cancelled' : 'badge-prep');
      return `
        <div class="order-card">
          <div class="order-card-header">
            <div>
              <h3 style="font-size: 1.15rem; margin-bottom: 4px;">${order.Restaurant_Name}</h3>
              <small class="text-muted"><i class="fa-regular fa-calendar"></i> ${new Date(order.Order_Date).toLocaleString()}</small>
            </div>
            <div>
              <span class="badge ${statusClass}">${order.Status}</span>
            </div>
          </div>

          <div class="order-items-summary">
            ${order.Items.map(i => `<div>• ${i.Quantity}x ${i.Name} (₹${i.Price * i.Quantity})</div>`).join('')}
          </div>

          <div class="order-card-footer">
            <div>
              <span class="text-muted" style="font-size: 0.82rem;">Total Bill:</span>
              <strong style="font-size: 1.1rem; color: var(--text-main);"> ₹${order.Total_Amount}</strong>
            </div>

            <div style="display: flex; gap: 8px;">
              <button class="btn btn-outline btn-sm" onclick="openTrackingModal(${order.Order_ID})">
                <i class="fa-solid fa-location-crosshairs"></i> Track Order
              </button>
              ${order.Status === 'Delivered' && !order.Review ? `
                <button class="btn btn-primary btn-sm" onclick="openReviewModal(${order.Order_ID})">
                  <i class="fa-solid fa-star"></i> Rate Food
                </button>
              ` : ''}
              ${order.Review ? `
                <span class="badge badge-delivered"><i class="fa-solid fa-check"></i> Rated ${order.Review.Rating}★</span>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    showToast('Failed to load customer orders: ' + err.message, 'error');
  }
}

// ==========================================
// RESTAURANT OWNER PORTAL (FR3, FR8)
// ==========================================
let ownerRestaurants = [];

async function loadOwnerDashboard() {
  try {
    const ordersRes = await fetch(`${API_BASE}/orders`, { headers: getHeaders() });
    const ordersData = await ordersRes.json();
    const orders = ordersData.orders || [];

    const restRes = await fetch(`${API_BASE}/restaurants`);
    const restData = await restRes.json();
    ownerRestaurants = (restData.restaurants || []).filter(r => r.Owner_ID === state.user.User_ID);

    // If owner has no restaurant, fallback to first restaurant for demo convenience
    const currentRestId = ownerRestaurants.length > 0 ? ownerRestaurants[0].Restaurant_ID : 1;

    // Fetch full menu for this restaurant
    const detailRes = await fetch(`${API_BASE}/restaurants/${currentRestId}`);
    const detailData = await detailRes.json();
    const menu = detailData.restaurant ? detailData.restaurant.menu : [];

    // Summary stats
    const activeOrders = orders.filter(o => o.Status !== 'Delivered' && o.Status !== 'Cancelled').length;
    const totalRev = orders.filter(o => o.Status === 'Delivered').reduce((sum, o) => sum + o.Total_Amount, 0);

    document.getElementById('owner-active-orders').textContent = activeOrders;
    document.getElementById('owner-total-revenue').textContent = `₹${totalRev}`;
    document.getElementById('owner-menu-count').textContent = menu.length;

    renderOwnerOrdersTable(orders);
    renderOwnerMenuTable(menu, currentRestId);
  } catch (err) {
    showToast('Failed to load owner dashboard: ' + err.message, 'error');
  }
}

function switchOwnerTab(tab, btn) {
  document.querySelectorAll('.portal-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.getElementById('owner-orders-tab').style.display = tab === 'orders' ? 'block' : 'none';
  document.getElementById('owner-menu-tab').style.display = tab === 'menu' ? 'block' : 'none';
}

function renderOwnerOrdersTable(orders) {
  const tbody = document.getElementById('owner-orders-table-body');
  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 24px;">No incoming orders yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>#${o.Order_ID}</strong></td>
      <td>
        <div><strong>${o.Customer_Name}</strong></div>
        <small class="text-muted">${o.Customer_Phone || ''}</small>
      </td>
      <td>
        ${o.Items.map(i => `${i.Quantity}x ${i.Name}`).join(', ')}
      </td>
      <td><strong>₹${o.Total_Amount}</strong></td>
      <td>${new Date(o.Order_Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
      <td>
        <span class="badge ${o.Status === 'Delivered' ? 'badge-delivered' : 'badge-prep'}">${o.Status}</span>
      </td>
      <td>
        <div style="display:flex; gap:6px;">
          ${o.Status === 'Placed' ? `
            <button class="btn btn-xs btn-primary" onclick="updateOrderStatus(${o.Order_ID}, 'Preparing')">Accept & Prepare</button>
            <button class="btn btn-xs btn-outline-danger" onclick="updateOrderStatus(${o.Order_ID}, 'Cancelled')">Reject</button>
          ` : ''}
          ${o.Status === 'Preparing' ? `
            <button class="btn btn-xs btn-primary" onclick="updateOrderStatus(${o.Order_ID}, 'Out for Delivery')">Send Out</button>
          ` : ''}
          ${o.Status === 'Out for Delivery' ? `
            <button class="btn btn-xs btn-primary" style="background:#10b981;" onclick="updateOrderStatus(${o.Order_ID}, 'Delivered')">Mark Delivered</button>
          ` : ''}
          ${o.Status === 'Delivered' || o.Status === 'Cancelled' ? `<span class="text-muted">Completed</span>` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

async function updateOrderStatus(orderId, status) {
  try {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    showToast(`Order #${orderId} updated to ${status}!`, 'success');
    loadOwnerDashboard();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function renderOwnerMenuTable(menu, currentRestId) {
  const tbody = document.getElementById('owner-menu-table-body');
  if (menu.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 24px;">No menu items added.</td></tr>`;
    return;
  }

  tbody.innerHTML = menu.map(m => `
    <tr>
      <td>
        <div style="display:flex; align-items:center; gap:10px;">
          <img src="${m.Image_URL || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'}" style="width:36px; height:36px; border-radius:6px; object-fit:cover;">
          <div>
            <strong>${m.Name}</strong>
            <div style="font-size:0.75rem; color:#64748b;">${m.Description ? m.Description.substring(0, 40) + '...' : ''}</div>
          </div>
        </div>
      </td>
      <td><span class="badge" style="background:#e0f2fe; color:#0369a1;">${m.Category}</span></td>
      <td><strong>₹${m.Price}</strong></td>
      <td>
        <button class="btn btn-xs ${m.Availability ? 'btn-outline' : 'btn-outline-danger'}" onclick="toggleMenuAvailability(${m.Item_ID}, ${!m.Availability})">
          <i class="fa-solid fa-${m.Availability ? 'check text-success' : 'ban'}"></i> ${m.Availability ? 'In Stock' : 'Out of Stock'}
        </button>
      </td>
      <td>
        <button class="btn btn-xs btn-outline" onclick="openEditMenuModal(${JSON.stringify(m).replace(/"/g, '&quot;')})">
          <i class="fa-solid fa-pen"></i> Edit
        </button>
        <button class="btn btn-xs btn-outline-danger" onclick="deleteMenuItem(${m.Item_ID})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

async function toggleMenuAvailability(itemId, availability) {
  try {
    const res = await fetch(`${API_BASE}/menu/${itemId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ Availability: availability })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    showToast('Menu availability updated!', 'success');
    loadOwnerDashboard();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteMenuItem(itemId) {
  if (!confirm('Are you sure you want to delete this menu item?')) return;
  try {
    const res = await fetch(`${API_BASE}/menu/${itemId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    showToast('Item deleted successfully!', 'success');
    loadOwnerDashboard();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function openAddMenuModal() {
  document.getElementById('menu-modal-title').textContent = 'Add New Menu Item';
  document.getElementById('menu-item-id').value = '';
  document.getElementById('menu-item-name').value = '';
  document.getElementById('menu-item-price').value = '';
  document.getElementById('menu-item-desc').value = '';
  document.getElementById('menu-item-image').value = '';
  document.getElementById('menu-item-avail').checked = true;
  document.getElementById('menu-modal').style.display = 'flex';
}

function openEditMenuModal(item) {
  document.getElementById('menu-modal-title').textContent = 'Edit Menu Item';
  document.getElementById('menu-item-id').value = item.Item_ID;
  document.getElementById('menu-item-name').value = item.Name;
  document.getElementById('menu-item-price').value = item.Price;
  document.getElementById('menu-item-category').value = item.Category;
  document.getElementById('menu-item-desc').value = item.Description || '';
  document.getElementById('menu-item-image').value = item.Image_URL || '';
  document.getElementById('menu-item-avail').checked = item.Availability;
  document.getElementById('menu-modal').style.display = 'flex';
}

function closeMenuModal() {
  document.getElementById('menu-modal').style.display = 'none';
}

async function handleMenuFormSubmit(e) {
  e.preventDefault();
  const itemId = document.getElementById('menu-item-id').value;
  const name = document.getElementById('menu-item-name').value;
  const price = document.getElementById('menu-item-price').value;
  const category = document.getElementById('menu-item-category').value;
  const desc = document.getElementById('menu-item-desc').value;
  const img = document.getElementById('menu-item-image').value;
  const avail = document.getElementById('menu-item-avail').checked;

  const currentRestId = ownerRestaurants.length > 0 ? ownerRestaurants[0].Restaurant_ID : 1;

  try {
    if (itemId) {
      // Edit
      const res = await fetch(`${API_BASE}/menu/${itemId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          Name: name,
          Price: price,
          Category: category,
          Description: desc,
          Image_URL: img,
          Availability: avail
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      showToast('Menu item updated successfully!', 'success');
    } else {
      // Add
      const res = await fetch(`${API_BASE}/restaurants/${currentRestId}/menu`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          Name: name,
          Price: price,
          Category: category,
          Description: desc,
          Image_URL: img,
          Availability: avail
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      showToast('Menu item created successfully!', 'success');
    }
    closeMenuModal();
    loadOwnerDashboard();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ==========================================
// ADMIN DASHBOARD & REPORTS (FR9)
// ==========================================
let currentAdminReports = null;
let currentAdminUsers = [];

async function loadAdminDashboard() {
  try {
    const [reportsRes, usersRes] = await Promise.all([
      fetch(`${API_BASE}/admin/reports`, { headers: getHeaders() }),
      fetch(`${API_BASE}/admin/users`, { headers: getHeaders() })
    ]);

    const reportsData = await reportsRes.json();
    const usersData = await usersRes.json();

    if (!reportsData.success) throw new Error(reportsData.message);

    currentAdminReports = reportsData.reports;
    currentAdminUsers = usersData.users || [];

    // Render Metrics
    document.getElementById('admin-total-revenue').textContent = `₹${currentAdminReports.summary.totalRevenue}`;
    document.getElementById('admin-total-orders').textContent = currentAdminReports.summary.totalOrders;
    document.getElementById('admin-total-restaurants').textContent = currentAdminReports.summary.totalRestaurants;
    document.getElementById('admin-total-users').textContent = currentAdminReports.summary.totalUsers;

    // Top Rated Restaurants
    const topBody = document.getElementById('admin-top-restaurants-body');
    topBody.innerHTML = currentAdminReports.topRestaurants.map(r => `
      <tr>
        <td><strong>${r.Name}</strong></td>
        <td><span class="badge badge-delivered"><i class="fa-solid fa-star"></i> ${r.Rating}</span></td>
        <td>${r.TotalOrders} orders</td>
        <td><small class="text-muted">${r.Address}</small></td>
      </tr>
    `).join('');

    // Sales by Restaurant
    const revBody = document.getElementById('admin-revenue-table-body');
    revBody.innerHTML = currentAdminReports.salesByRestaurant.map(s => `
      <tr>
        <td><strong>${s.Restaurant_Name}</strong></td>
        <td>${s.Orders_Count} orders</td>
        <td><strong>₹${s.Revenue}</strong></td>
      </tr>
    `).join('');

    // Users Table
    const usersBody = document.getElementById('admin-users-table-body');
    usersBody.innerHTML = currentAdminUsers.map(u => `
      <tr>
        <td>#${u.User_ID}</td>
        <td><strong>${u.Name}</strong></td>
        <td>${u.Email}</td>
        <td>${u.Phone}</td>
        <td><span class="badge ${u.Role === 'Admin' ? 'badge-prep' : (u.Role === 'Restaurant Owner' ? 'badge-placed' : 'badge-delivered')}">${u.Role}</span></td>
        <td>
          ${u.Role !== 'Admin' ? `
            <button class="btn btn-xs btn-outline-danger" onclick="deleteUserAccount(${u.User_ID})">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          ` : '<small class="text-muted">Master Admin</small>'}
        </td>
      </tr>
    `).join('');
  } catch (err) {
    showToast('Failed to load admin dashboard: ' + err.message, 'error');
  }
}

async function deleteUserAccount(id) {
  if (!confirm('Are you sure you want to remove this user?')) return;
  try {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    showToast('User account deleted successfully.', 'success');
    loadAdminDashboard();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// FR9: CSV Report Export
function downloadCSVReport(type) {
  if (!currentAdminReports) return;

  let csvContent = "data:text/csv;charset=utf-8,";
  let filename = "Report.csv";

  if (type === 'sales') {
    filename = "Sales_Revenue_Report.csv";
    csvContent += "Restaurant_ID,Restaurant_Name,Total_Orders,Gross_Revenue_INR\n";
    currentAdminReports.salesByRestaurant.forEach(r => {
      csvContent += `${r.Restaurant_ID},"${r.Restaurant_Name}",${r.Orders_Count},${r.Revenue}\n`;
    });
  } else if (type === 'orders') {
    filename = "Order_History_Report.csv";
    csvContent += "Order_ID,Customer_Name,Restaurant_Name,Total_Amount_INR,Status,Order_Date\n";
    (currentAdminReports.recentOrders || []).forEach(o => {
      csvContent += `${o.Order_ID},"${o.Customer_Name}","${o.Restaurant_Name}",${o.Total_Amount},${o.Status},${o.Order_Date}\n`;
    });
  }

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast(`Downloaded ${filename} successfully!`, 'success');
}
