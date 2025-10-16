import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = async (req, res, next) => {

  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req._id = decoded.userId
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export default authMiddleware;