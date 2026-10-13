const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'food-ordering-system-secret-key-2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Auth Helper Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
}

// Optional Auth (for routes that work for guests or logged in users)
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) req.user = user;
      next();
    });
  } else {
    next();
  }
}

// ==========================================
// 1. AUTHENTICATION (FR1)
// ==========================================
app.post('/api/auth/register', (req, res) => {
  try {
    const { Name, Email, Phone, Password, Role } = req.body;
    if (!Name || !Email || !Phone || !Password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const newUser = db.createUser({ Name, Email, Phone, Password, Role });
    const token = jwt.sign(
      { User_ID: newUser.User_ID, Email: newUser.Email, Role: newUser.Role, Name: newUser.Name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: newUser
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res.status(400).json({ success: false, message: 'Email and Password are required.' });
    }

    const user = db.getUserByEmail(Email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = bcrypt.compareSync(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password mismatch.' });
    }

    const token = jwt.sign(
      { User_ID: user.User_ID, Email: user.Email, Role: user.Role, Name: user.Name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { Password: _, ...safeUser } = user;
    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: safeUser
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.getUserById(req.user.User_ID);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }
  const { Password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser });
});

// ==========================================
// 2. RESTAURANTS & MENUS (FR2, FR3)
// ==========================================
app.get('/api/restaurants', (req, res) => {
  try {
    const { search = '', category = '' } = req.query;
    const list = db.getRestaurants(search, category);
    res.json({ success: true, count: list.length, restaurants: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/restaurants/:id', (req, res) => {
  try {
    const restaurant = db.getRestaurantById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }
    res.json({ success: true, restaurant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/restaurants', authenticateToken, (req, res) => {
  try {
    if (req.user.Role !== 'Restaurant Owner' && req.user.Role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Only restaurant owners or admin can add a restaurant.' });
    }
    const { Name, Address, Cuisine, Image_URL, Delivery_Time, Cost_For_Two } = req.body;
    const newRest = db.createRestaurant({
      Name,
      Address,
      Owner_ID: req.user.User_ID,
      Cuisine,
      Image_URL,
      Delivery_Time,
      Cost_For_Two
    });
    res.status(201).json({ success: true, message: 'Restaurant created successfully!', restaurant: newRest });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Menu Management (FR3)
app.post('/api/restaurants/:id/menu', authenticateToken, (req, res) => {
  try {
    if (req.user.Role !== 'Restaurant Owner' && req.user.Role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Permission denied.' });
    }
    const restaurant = db.getRestaurantById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

    const { Name, Price, Category, Availability, Description, Image_URL } = req.body;
    const item = db.createMenuItem({
      Restaurant_ID: req.params.id,
      Name,
      Price,
      Category,
      Availability,
      Description,
      Image_URL
    });

    res.status(201).json({ success: true, message: 'Menu item added successfully!', item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.put('/api/menu/:id', authenticateToken, (req, res) => {
  try {
    if (req.user.Role !== 'Restaurant Owner' && req.user.Role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Permission denied.' });
    }
    const updated = db.updateMenuItem(req.params.id, req.body);
    res.json({ success: true, message: 'Menu updated successfully.', item: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.delete('/api/menu/:id', authenticateToken, (req, res) => {
  try {
    if (req.user.Role !== 'Restaurant Owner' && req.user.Role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Permission denied.' });
    }
    const deleted = db.deleteMenuItem(req.params.id);
    res.json({ success: true, message: 'Menu item deleted successfully.', item: deleted });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ==========================================
// 3. CART & ORDER PLACEMENT (FR4, FR6, FR8)
// ==========================================
app.post('/api/orders', authenticateToken, (req, res) => {
  try {
    const { Restaurant_ID, Delivery_Address, Items, Total_Amount, Payment_Method } = req.body;

    if (!Restaurant_ID || !Delivery_Address || !Items || Items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid order payload. Missing items or address.' });
    }

    // Create Order
    const order = db.createOrder({
      Customer_ID: req.user.User_ID,
      Restaurant_ID,
      Delivery_Address,
      Items,
      Total_Amount
    });

    // Auto process initial payment if method was chosen (FR5)
    let payment = null;
    if (Payment_Method) {
      payment = db.createPayment({
        Order_ID: order.Order_ID,
        Amount: Total_Amount,
        Payment_Method,
        Payment_Status: 'Successful'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order Placed Successfully!',
      order: { ...order, Payment: payment }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.get('/api/orders', authenticateToken, (req, res) => {
  try {
    let orders;
    if (req.user.Role === 'Customer') {
      orders = db.getOrders({ customerId: req.user.User_ID });
    } else if (req.user.Role === 'Restaurant Owner') {
      orders = db.getOrders({ ownerId: req.user.User_ID });
    } else {
      // Admin gets all orders
      orders = db.getOrders();
    }
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/orders/:id', authenticateToken, (req, res) => {
  try {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Order Management for Restaurant Owner (FR8)
app.put('/api/orders/:id/status', authenticateToken, (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const updated = db.updateOrderStatus(req.params.id, status);
    res.json({ success: true, message: `Order status updated to '${status}'.`, order: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ==========================================
// 4. ONLINE PAYMENT (FR5)
// ==========================================
app.post('/api/orders/:id/pay', authenticateToken, (req, res) => {
  try {
    const { Payment_Method, CardDetails, UpiId } = req.body;
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.Payment && order.Payment.Payment_Status === 'Successful') {
      return res.status(400).json({ success: false, message: 'Order is already paid.' });
    }

    const payment = db.createPayment({
      Order_ID: order.Order_ID,
      Amount: order.Total_Amount,
      Payment_Method: Payment_Method || 'UPI',
      Payment_Status: 'Successful'
    });

    res.json({
      success: true,
      message: 'Payment Successful!',
      payment
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ==========================================
// 5. RATINGS AND REVIEWS (FR7)
// ==========================================
app.post('/api/orders/:id/review', authenticateToken, (req, res) => {
  try {
    const { Rating, Comment } = req.body;
    if (!Rating || !Comment) {
      return res.status(400).json({ success: false, message: 'Rating and Comment are required.' });
    }

    const review = db.createReview({
      Order_ID: req.params.id,
      Customer_ID: req.user.User_ID,
      Rating: Number(Rating),
      Comment
    });

    res.status(201).json({
      success: true,
      message: 'Review Submitted Successfully!',
      review
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.get('/api/restaurants/:id/reviews', (req, res) => {
  try {
    const restaurant = db.getRestaurantById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    res.json({ success: true, reviews: restaurant.reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 6. ADMIN DASHBOARD & REPORTS (FR9)
// ==========================================
app.get('/api/admin/reports', authenticateToken, (req, res) => {
  try {
    if (req.user.Role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }
    const reports = db.getAdminReports();
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/admin/users', authenticateToken, (req, res) => {
  try {
    if (req.user.Role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }
    const users = db.getUsers();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, (req, res) => {
  try {
    if (req.user.Role !== 'Admin') {
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }
    const deleted = db.deleteUser(req.params.id);
    res.json({ success: true, message: 'User deleted successfully.', user: deleted });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Online Food Ordering System Server Running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`👨‍💻 Author: Adithya Kumaresan`);
  console.log(`====================================================`);
});
