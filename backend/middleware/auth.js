// Middleware за auth и само за admin
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

export async function adminOnly(req, res, next) {
  // req.user.role треба да постои од authMiddleware
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Само админ може да пристапи.' });
  }
  next();
}
