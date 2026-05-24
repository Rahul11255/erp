const jwt = require('jsonwebtoken');
const db  = require('../../db/db');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status:  false,
        code:    401,
        message: 'No token provided. Please login.',
      });
    }

    const token   = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

 
    const user = await db('users')
      .where({ id: decoded.id })
      .first();

    if (!user) {
      return res.status(401).json({
        status:  false,
        code:    401,
        message: 'User no longer exists',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      status:  false,
      code:    401,
      message: 'Invalid or expired token',
      error:   err.message,
    });
  }
};

const managerOnly = (req, res, next) => {
  if (req.user.role !== 'MANAGER') {
    return res.status(403).json({
      status:  false,
      code:    403,
      message: 'Manager access required',
    });
  }
  next();
};

module.exports = { protect, managerOnly };