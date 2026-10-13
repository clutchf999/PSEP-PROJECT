const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getDefaultData() {
  const salt = bcrypt.genSaltSync(10);
  const defaultHashedPassword = bcrypt.hashSync('password123', salt);

  return {
    users: [
      {
        User_ID: 1,
        Name: 'Adithya Kumaresan',
        Email: 'adithya@example.com',
        Phone: '9876543210',
        Password: defaultHashedPassword,
        Role: 'Customer',
        Created_At: '2026-10-01T10:00:00.000Z'
      },
      {
        User_ID: 2,
        Name: 'Marco Chef (Owner)',
        Email: 'owner@bistro.com',
        Phone: '9876501234',
        Password: defaultHashedPassword,
        Role: 'Restaurant Owner',
        Created_At: '2026-10-01T10:00:00.000Z'
      },
      {
        User_ID: 3,
        Name: 'System Admin',
        Email: 'admin@foodapp.com',
        Phone: '9998887776',
        Password: defaultHashedPassword,
        Role: 'Admin',
        Created_At: '2026-10-01T10:00:00.000Z'
      }
    ],
    restaurants: [
      {
        Restaurant_ID: 1,
        Name: 'Spice Symphony',
        Address: '42 MG Road, Indiranagar, Bengaluru',
        Owner_ID: 2,
        Rating: 4.8,
        Cuisine: 'North Indian, Biryani',
        Image_URL: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        Delivery_Time: '25-35 mins',
        Cost_For_Two: 450,
        Created_At: '2026-10-01T10:00:00.000Z'
      },
      {
        Restaurant_ID: 2,
        Name: 'Urban Burger Club',
        Address: '15 High Street, Koramangala, Bengaluru',
        Owner_ID: 2,
        Rating: 4.6,
        Cuisine: 'Burgers, Fast Food, Shakes',
        Image_URL: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
        Delivery_Time: '20-30 mins',
        Cost_For_Two: 350,
        Created_At: '2026-10-02T10:00:00.000Z'
      },
      {
        Restaurant_ID: 3,
        Name: 'Bella Italia Woodfire',
        Address: '88 Central Avenue, Whitefield, Bengaluru',
        Owner_ID: 2,
        Rating: 4.7,
        Cuisine: 'Italian, Pizza, Pasta',
        Image_URL: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
        Delivery_Time: '30-40 mins',
        Cost_For_Two: 600,
        Created_At: '2026-10-03T10:00:00.000Z'
      },
      {
        Restaurant_ID: 4,
        Name: 'Dragon Wok Express',
        Address: '23 Residency Road, Ashok Nagar, Bengaluru',
        Owner_ID: 2,
        Rating: 4.5,
        Cuisine: 'Chinese, Asian, Dimsums',
        Image_URL: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
        Delivery_Time: '25-35 mins',
        Cost_For_Two: 400,
        Created_At: '2026-10-04T10:00:00.000Z'
      }
    ],
    menu_items: [
      // Restaurant 1: Spice Symphony
      {
        Item_ID: 1,
        Restaurant_ID: 1,
        Name: 'Hyderabadi Dum Biryani',
        Price: 280,
        Category: 'Biryani',
        Availability: true,
        Description: 'Fragrant basmati rice layered with spiced marinated paneer and saffron.',
        Image_URL: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80'
      },
      {
        Item_ID: 2,
        Restaurant_ID: 1,
        Name: 'Paneer Butter Masala',
        Price: 220,
        Category: 'Mains',
        Availability: true,
        Description: 'Rich and creamy tomato gravy infused with fresh butter and cottage cheese.',
        Image_URL: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80'
      },
      {
        Item_ID: 3,
        Restaurant_ID: 1,
        Name: 'Garlic Butter Naan',
        Price: 50,
        Category: 'Breads',
        Availability: true,
        Description: 'Crisp, tandoor-baked Indian bread topped with minced garlic and butter.',
        Image_URL: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80'
      },
      {
        Item_ID: 4,
        Restaurant_ID: 1,
        Name: 'Gulab Jamun (2 Pcs)',
        Price: 80,
        Category: 'Desserts',
        Availability: true,
        Description: 'Golden khoya dumplings soaked in warm rose-infused sugar syrup.',
        Image_URL: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80'
      },

      // Restaurant 2: Urban Burger Club
      {
        Item_ID: 5,
        Restaurant_ID: 2,
        Name: 'Classic Double Cheeseburger',
        Price: 199,
        Category: 'Burgers',
        Availability: true,
        Description: 'Double grilled patty, melted cheddar, pickles, secret sauce on toasted brioche.',
        Image_URL: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80'
      },
      {
        Item_ID: 6,
        Restaurant_ID: 2,
        Name: 'Crispy Peri Peri Fries',
        Price: 99,
        Category: 'Sides',
        Availability: true,
        Description: 'Golden crunchy potato fries tossed in zesty peri-peri seasoning.',
        Image_URL: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=400&q=80'
      },
      {
        Item_ID: 7,
        Restaurant_ID: 2,
        Name: 'Belgian Chocolate Shake',
        Price: 140,
        Category: 'Beverages',
        Availability: true,
        Description: 'Thick, creamy blend of Belgian dark chocolate and rich ice cream.',
        Image_URL: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80'
      },

      // Restaurant 3: Bella Italia Woodfire
      {
        Item_ID: 8,
        Restaurant_ID: 3,
        Name: 'Margherita Woodfire Pizza',
        Price: 320,
        Category: 'Pizza',
        Availability: true,
        Description: 'San Marzano tomato base, fresh mozzarella bocconcini, and sweet basil leaves.',
        Image_URL: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=400&q=80'
      },
      {
        Item_ID: 9,
        Restaurant_ID: 3,
        Name: 'Creamy Alfredo Penne Pasta',
        Price: 280,
        Category: 'Pasta',
        Availability: true,
        Description: 'Penne tossed with sautéed mushrooms, garlic cream sauce, and parmesan.',
        Image_URL: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=400&q=80'
      },
      {
        Item_ID: 10,
        Restaurant_ID: 3,
        Name: 'Tiramisu Classico',
        Price: 180,
        Category: 'Desserts',
        Availability: true,
        Description: 'Authentic espresso-soaked ladyfingers with mascarpone cream and cocoa powder.',
        Image_URL: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80'
      },

      // Restaurant 4: Dragon Wok Express
      {
        Item_ID: 11,
        Restaurant_ID: 4,
        Name: 'Chilli Garlic Hakka Noodles',
        Price: 180,
        Category: 'Chinese',
        Availability: true,
        Description: 'Wok-tossed noodles with shredded vegetables, red chillies, and fried garlic.',
        Image_URL: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=400&q=80'
      },
      {
        Item_ID: 12,
        Restaurant_ID: 4,
        Name: 'Crispy Veg Spring Rolls',
        Price: 160,
        Category: 'Starters',
        Availability: true,
        Description: 'Crisp pastry rolls filled with garden vegetables, served with sweet chilli sauce.',
        Image_URL: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'
      }
    ],
    orders: [
      {
        Order_ID: 101,
        Customer_ID: 1,
        Restaurant_ID: 1,
        Order_Date: '2026-10-12T13:15:00.000Z',
        Status: 'Delivered',
        Total_Amount: 550,
        Delivery_Address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru - 560103',
        Items: [
          { Item_ID: 1, Name: 'Hyderabadi Dum Biryani', Quantity: 1, Price: 280 },
          { Item_ID: 2, Name: 'Paneer Butter Masala', Quantity: 1, Price: 220 },
          { Item_ID: 3, Name: 'Garlic Butter Naan', Quantity: 1, Price: 50 }
        ]
      },
      {
        Order_ID: 102,
        Customer_ID: 1,
        Restaurant_ID: 2,
        Order_Date: '2026-10-13T12:30:00.000Z',
        Status: 'Preparing',
        Total_Amount: 298,
        Delivery_Address: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru - 560103',
        Items: [
          { Item_ID: 5, Name: 'Classic Double Cheeseburger', Quantity: 1, Price: 199 },
          { Item_ID: 6, Name: 'Crispy Peri Peri Fries', Quantity: 1, Price: 99 }
        ]
      }
    ],
    payments: [
      {
        Payment_ID: 1,
        Order_ID: 101,
        Amount: 550,
        Payment_Method: 'UPI',
        Payment_Status: 'Successful',
        Transaction_ID: 'TXN_UPI_98234710',
        Payment_Date: '2026-10-12T13:16:00.000Z'
      },
      {
        Payment_ID: 2,
        Order_ID: 102,
        Amount: 298,
        Payment_Method: 'Card',
        Payment_Status: 'Successful',
        Transaction_ID: 'TXN_CARD_55489123',
        Payment_Date: '2026-10-13T12:31:00.000Z'
      }
    ],
    reviews: [
      {
        Review_ID: 1,
        Order_ID: 101,
        Customer_ID: 1,
        Customer_Name: 'Adithya Kumaresan',
        Restaurant_ID: 1,
        Rating: 5,
        Comment: 'Outstanding authentic biryani! Packaging was neat and delivered piping hot.',
        Created_At: '2026-10-12T14:00:00.000Z'
      }
    ]
  };
}

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      const initialData = getDefaultData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    }
  }

  read() {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      const initial = getDefaultData();
      this.write(initial);
      return initial;
    }
  }

  write(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  // --- Users ---
  getUsers() {
    const db = this.read();
    return db.users.map(u => {
      const { Password, ...safeUser } = u;
      return safeUser;
    });
  }

  getUserById(id) {
    const db = this.read();
    return db.users.find(u => u.User_ID === Number(id));
  }

  getUserByEmail(email) {
    const db = this.read();
    return db.users.find(u => u.Email.toLowerCase() === email.toLowerCase());
  }

  createUser({ Name, Email, Phone, Password, Role }) {
    const db = this.read();
    if (db.users.some(u => u.Email.toLowerCase() === Email.toLowerCase())) {
      throw new Error('A user with this email already exists.');
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(Password, salt);
    const newId = db.users.length > 0 ? Math.max(...db.users.map(u => u.User_ID)) + 1 : 1;
    const newUser = {
      User_ID: newId,
      Name,
      Email,
      Phone,
      Password: hashedPassword,
      Role: Role || 'Customer',
      Created_At: new Date().toISOString()
    };
    db.users.push(newUser);
    this.write(db);
    const { Password: _, ...safeUser } = newUser;
    return safeUser;
  }

  deleteUser(id) {
    const db = this.read();
    const index = db.users.findIndex(u => u.User_ID === Number(id));
    if (index === -1) throw new Error('User not found.');
    const removed = db.users.splice(index, 1)[0];
    this.write(db);
    return removed;
  }

  // --- Restaurants ---
  getRestaurants(search = '', category = '') {
    const db = this.read();
    let list = db.restaurants;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(r => 
        r.Name.toLowerCase().includes(q) ||
        r.Cuisine.toLowerCase().includes(q) ||
        r.Address.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      const qCat = category.toLowerCase();
      // Find restaurants with matching category in cuisine or in their menu items
      const matchingRestIds = db.menu_items
        .filter(m => m.Category.toLowerCase().includes(qCat))
        .map(m => m.Restaurant_ID);

      list = list.filter(r => 
        r.Cuisine.toLowerCase().includes(qCat) ||
        matchingRestIds.includes(r.Restaurant_ID)
      );
    }

    return list;
  }

  getRestaurantById(id) {
    const db = this.read();
    const restaurant = db.restaurants.find(r => r.Restaurant_ID === Number(id));
    if (!restaurant) return null;
    const menu = db.menu_items.filter(m => m.Restaurant_ID === Number(id));
    const reviews = db.reviews.filter(rv => rv.Restaurant_ID === Number(id));
    return { ...restaurant, menu, reviews };
  }

  createRestaurant({ Name, Address, Owner_ID, Cuisine, Image_URL, Delivery_Time, Cost_For_Two }) {
    const db = this.read();
    const newId = db.restaurants.length > 0 ? Math.max(...db.restaurants.map(r => r.Restaurant_ID)) + 1 : 1;
    const newRest = {
      Restaurant_ID: newId,
      Name,
      Address,
      Owner_ID: Number(Owner_ID),
      Rating: 5.0,
      Cuisine: Cuisine || 'Multi-Cuisine',
      Image_URL: Image_URL || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      Delivery_Time: Delivery_Time || '25-35 mins',
      Cost_For_Two: Number(Cost_For_Two) || 400,
      Created_At: new Date().toISOString()
    };
    db.restaurants.push(newRest);
    this.write(db);
    return newRest;
  }

  updateRestaurant(id, data) {
    const db = this.read();
    const rest = db.restaurants.find(r => r.Restaurant_ID === Number(id));
    if (!rest) throw new Error('Restaurant not found');
    Object.assign(rest, data);
    this.write(db);
    return rest;
  }

  // --- Menu Items ---
  getMenuItems(restaurantId) {
    const db = this.read();
    return db.menu_items.filter(m => m.Restaurant_ID === Number(restaurantId));
  }

  createMenuItem({ Restaurant_ID, Name, Price, Category, Availability = true, Description = '', Image_URL = '' }) {
    const db = this.read();
    const newId = db.menu_items.length > 0 ? Math.max(...db.menu_items.map(m => m.Item_ID)) + 1 : 1;
    const newItem = {
      Item_ID: newId,
      Restaurant_ID: Number(Restaurant_ID),
      Name,
      Price: Number(Price),
      Category: Category || 'General',
      Availability: Boolean(Availability),
      Description,
      Image_URL: Image_URL || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'
    };
    db.menu_items.push(newItem);
    this.write(db);
    return newItem;
  }

  updateMenuItem(id, updates) {
    const db = this.read();
    const item = db.menu_items.find(m => m.Item_ID === Number(id));
    if (!item) throw new Error('Menu item not found.');
    if (updates.Name !== undefined) item.Name = updates.Name;
    if (updates.Price !== undefined) item.Price = Number(updates.Price);
    if (updates.Category !== undefined) item.Category = updates.Category;
    if (updates.Availability !== undefined) item.Availability = Boolean(updates.Availability);
    if (updates.Description !== undefined) item.Description = updates.Description;
    if (updates.Image_URL !== undefined) item.Image_URL = updates.Image_URL;
    this.write(db);
    return item;
  }

  deleteMenuItem(id) {
    const db = this.read();
    const idx = db.menu_items.findIndex(m => m.Item_ID === Number(id));
    if (idx === -1) throw new Error('Menu item not found.');
    const removed = db.menu_items.splice(idx, 1)[0];
    this.write(db);
    return removed;
  }

  // --- Orders ---
  getOrders({ customerId, ownerId, status } = {}) {
    const db = this.read();
    let orders = [...db.orders];

    if (customerId) {
      orders = orders.filter(o => o.Customer_ID === Number(customerId));
    }

    if (ownerId) {
      const ownerRestIds = db.restaurants
        .filter(r => r.Owner_ID === Number(ownerId))
        .map(r => r.Restaurant_ID);
      orders = orders.filter(o => ownerRestIds.includes(o.Restaurant_ID));
    }

    if (status) {
      orders = orders.filter(o => o.Status.toLowerCase() === status.toLowerCase());
    }

    // Enrich with restaurant and customer names
    return orders.map(o => {
      const rest = db.restaurants.find(r => r.Restaurant_ID === o.Restaurant_ID);
      const cust = db.users.find(u => u.User_ID === o.Customer_ID);
      const pmt = db.payments.find(p => p.Order_ID === o.Order_ID);
      const rev = db.reviews.find(r => r.Order_ID === o.Order_ID);
      return {
        ...o,
        Restaurant_Name: rest ? rest.Name : 'Restaurant #' + o.Restaurant_ID,
        Customer_Name: cust ? cust.Name : 'Customer #' + o.Customer_ID,
        Customer_Phone: cust ? cust.Phone : '',
        Payment: pmt || null,
        Review: rev || null
      };
    }).sort((a, b) => new Date(b.Order_Date) - new Date(a.Order_Date));
  }

  getOrderById(id) {
    const db = this.read();
    const order = db.orders.find(o => o.Order_ID === Number(id));
    if (!order) return null;
    const rest = db.restaurants.find(r => r.Restaurant_ID === order.Restaurant_ID);
    const cust = db.users.find(u => u.User_ID === order.Customer_ID);
    const pmt = db.payments.find(p => p.Order_ID === order.Order_ID);
    const rev = db.reviews.find(r => r.Order_ID === order.Order_ID);
    return {
      ...order,
      Restaurant_Name: rest ? rest.Name : 'Restaurant #' + order.Restaurant_ID,
      Customer_Name: cust ? cust.Name : 'Customer #' + order.Customer_ID,
      Customer_Phone: cust ? cust.Phone : '',
      Payment: pmt || null,
      Review: rev || null
    };
  }

  createOrder({ Customer_ID, Restaurant_ID, Delivery_Address, Items, Total_Amount }) {
    const db = this.read();
    const newId = db.orders.length > 0 ? Math.max(...db.orders.map(o => o.Order_ID)) + 1 : 101;
    const newOrder = {
      Order_ID: newId,
      Customer_ID: Number(Customer_ID),
      Restaurant_ID: Number(Restaurant_ID),
      Order_Date: new Date().toISOString(),
      Status: 'Placed',
      Total_Amount: Number(Total_Amount),
      Delivery_Address,
      Items: Items || []
    };
    db.orders.push(newOrder);
    this.write(db);
    return this.getOrderById(newId);
  }

  updateOrderStatus(orderId, status) {
    const db = this.read();
    const order = db.orders.find(o => o.Order_ID === Number(orderId));
    if (!order) throw new Error('Order not found.');
    order.Status = status;
    this.write(db);
    return this.getOrderById(orderId);
  }

  // --- Payments ---
  createPayment({ Order_ID, Amount, Payment_Method, Payment_Status = 'Successful' }) {
    const db = this.read();
    const newId = db.payments.length > 0 ? Math.max(...db.payments.map(p => p.Payment_ID)) + 1 : 1;
    const txnId = 'TXN_' + Payment_Method.toUpperCase() + '_' + Math.floor(10000000 + Math.random() * 90000000);
    const newPayment = {
      Payment_ID: newId,
      Order_ID: Number(Order_ID),
      Amount: Number(Amount),
      Payment_Method,
      Payment_Status,
      Transaction_ID: txnId,
      Payment_Date: new Date().toISOString()
    };
    db.payments.push(newPayment);
    this.write(db);
    return newPayment;
  }

  // --- Reviews ---
  createReview({ Order_ID, Customer_ID, Rating, Comment }) {
    const db = this.read();
    const order = db.orders.find(o => o.Order_ID === Number(Order_ID));
    if (!order) throw new Error('Order not found.');
    if (order.Status !== 'Delivered') {
      throw new Error('Ratings can only be submitted after order delivery is confirmed.');
    }
    const customer = db.users.find(u => u.User_ID === Number(Customer_ID));
    const newId = db.reviews.length > 0 ? Math.max(...db.reviews.map(r => r.Review_ID)) + 1 : 1;
    const newReview = {
      Review_ID: newId,
      Order_ID: Number(Order_ID),
      Customer_ID: Number(Customer_ID),
      Customer_Name: customer ? customer.Name : 'Customer',
      Restaurant_ID: order.Restaurant_ID,
      Rating: Number(Rating),
      Comment,
      Created_At: new Date().toISOString()
    };
    db.reviews.push(newReview);

    // Recalculate restaurant rating
    const restReviews = db.reviews.filter(r => r.Restaurant_ID === order.Restaurant_ID);
    const avgRating = (restReviews.reduce((sum, r) => sum + r.Rating, 0) / restReviews.length).toFixed(1);
    const rest = db.restaurants.find(r => r.Restaurant_ID === order.Restaurant_ID);
    if (rest) {
      rest.Rating = parseFloat(avgRating);
    }

    this.write(db);
    return newReview;
  }

  // --- Admin Reports (FR9) ---
  getAdminReports() {
    const db = this.read();
    const totalRevenue = db.payments
      .filter(p => p.Payment_Status === 'Successful')
      .reduce((sum, p) => sum + p.Amount, 0);

    const totalOrders = db.orders.length;
    const totalUsers = db.users.length;
    const totalRestaurants = db.restaurants.length;

    // Top rated restaurants
    const topRestaurants = [...db.restaurants]
      .sort((a, b) => b.Rating - a.Rating)
      .slice(0, 5)
      .map(r => ({
        Restaurant_ID: r.Restaurant_ID,
        Name: r.Name,
        Rating: r.Rating,
        Address: r.Address,
        TotalOrders: db.orders.filter(o => o.Restaurant_ID === r.Restaurant_ID).length
      }));

    // Sales by Restaurant
    const salesByRestaurant = db.restaurants.map(r => {
      const restOrders = db.orders.filter(o => o.Restaurant_ID === r.Restaurant_ID);
      const revenue = restOrders.reduce((sum, o) => sum + o.Total_Amount, 0);
      return {
        Restaurant_ID: r.Restaurant_ID,
        Restaurant_Name: r.Name,
        Orders_Count: restOrders.length,
        Revenue: revenue
      };
    });

    // Order status breakdown
    const ordersByStatus = {
      Placed: db.orders.filter(o => o.Status === 'Placed').length,
      Preparing: db.orders.filter(o => o.Status === 'Preparing').length,
      'Out for Delivery': db.orders.filter(o => o.Status === 'Out for Delivery').length,
      Delivered: db.orders.filter(o => o.Status === 'Delivered').length,
      Cancelled: db.orders.filter(o => o.Status === 'Cancelled').length
    };

    return {
      summary: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalRestaurants
      },
      topRestaurants,
      salesByRestaurant,
      ordersByStatus,
      recentOrders: this.getOrders().slice(0, 10)
    };
  }
}

module.exports = new Database();
