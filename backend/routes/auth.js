const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = req.db.data.users.find(u => u.email === email && u.password === password);
  if (user) {
    user.lastLogin = new Date().toISOString();
    req.db.write();
    res.json({ token: 'fake-jwt-token', user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
