import jwt from 'jsonwebtoken';

const verifyToken = (token) => {
  if (!token) throw new Error('Token missing');
  
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT secret not set');

  return jwt.verify(token, secret); // returns decoded payload
};

export default verifyToken;
