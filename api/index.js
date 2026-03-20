const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Products route
app.get('/products', (req, res) => {
  res.json([
    { id: 1, name: 'Wireless Headphones', price: 49.99 },
    { id: 2, name: 'Mechanical Keyboard', price: 89.99 },
    { id: 3, name: 'USB-C Hub', price: 29.99 },
  ]);
});

// User login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.json({ token: 'mock-jwt-token', user: { email } });
  } else {
    res.status(400).json({ error: 'Email and password required' });
  }
});

// Place order route
app.post('/orders', (req, res) => {
  const { userId, items } = req.body;
  if (!userId || !items || items.length === 0) {
    return res.status(400).json({ error: 'userId and items are required' });
  }
  res.status(201).json({
    orderId: 'ORD-' + Date.now(),
    userId,
    items,
    status: 'placed',
  });
});

module.exports = app;

if (require.main === module) {
  app.listen(3001, () => console.log('API running on port 3001'));
}