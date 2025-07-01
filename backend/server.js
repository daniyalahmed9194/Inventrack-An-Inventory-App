const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { JSONFileSync } = require('lowdb/node');
const { LowSync } = require('lowdb');
const path = require('path');

// Create express app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// File path
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFileSync(file);

// ✅ Pass defaultData at the time of creating LowSync
const db = new LowSync(adapter, {
  defaultData: {
    users: [],
    products: [],
    orders: [],
    suppliers: []
  }
});

db.read(); // Load db.json or use defaults

// Attach db to req
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes (even empty route files must exist)
app.use('/products', require('./routes/products'));

app.use('/orders', require('./routes/orders'));
app.use('/suppliers', require('./routes/suppliers'));
app.use('/auth', require('./routes/auth'));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Inventrack backend running at http://localhost:${PORT}`);
});
