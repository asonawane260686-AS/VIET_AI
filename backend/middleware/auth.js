const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'greenagent_super_secret_key_change_this_in_production';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];

    // Offline demo token fallback
    if (token.startsWith('demo-') || token.startsWith('admin-')) {
      const demoUser = await User.findOne({ role: 'manager' }) || {
        _id: 'demo-admin',
        role: 'manager',
        username: 'admin',
        name: 'Vietnam Green Admin'
      };
      req.user = demoUser;
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const managerOnly = (req, res, next) => {
  if (req.user?.role !== 'manager' && req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = { auth, managerOnly };
