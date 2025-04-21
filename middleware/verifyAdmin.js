import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js'; // make sure you have this model

export const verifyAdmin = async (req, res, next) => {
  const token = req.cookies.token; // using HTTP-only cookies

  if (!token) return res.status(401).json({ message: 'No token, admin unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId); // assuming token has adminId

    if (!admin) return res.status(403).json({ message: 'Admin not found or invalid token' });

    req.adminId = admin._id;
    next(); // 🟢 let the admin do their thing
  } catch (err) {
    res.status(403).json({ message: 'Token invalid or expired' });
  }
};
