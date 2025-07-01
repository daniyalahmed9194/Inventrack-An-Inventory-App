const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

// Get all orders
router.get('/', (req, res) => {
  res.json(req.db.data.orders);
});

// Get product by ID
router.get('/:id', (req, res) => {
  const product = req.db.data.orders.find(p => p.id == req.params.id);
  product ? res.json(product) : res.sendStatus(404);
});

// Add new product
router.post('/', (req, res) => {
  const newProduct = { id: nanoid(), ...req.body };
  req.db.data.orders.push(newProduct);
  req.db.write();
  res.status(201).json(newProduct);
});

// Update product
router.patch('/:id', (req, res) => {
  const product = req.db.data.orders.find(p => p.id == req.params.id);
  if (!product) return res.sendStatus(404);
  Object.assign(product, req.body);
  req.db.write();
  res.json(product);
});

// Delete product
router.delete('/:id', (req, res) => {
  req.db.data.orders = req.db.data.orders.filter(p => p.id != req.params.id);
  req.db.write();
  res.sendStatus(204);
});

module.exports = router;
