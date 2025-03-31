import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../interfaces/auth.interfaces.js';

// the params are the user id and the user name
export const generateToken = (uid: string, name: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const payload: IJwtPayload = { uid, name };
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET_SEED || '',
      { expiresIn: '2h' },
      (err, token) => {
        if (err) reject('Error generating token');
        resolve(token as string);
      }
    );
  });
}

export const verifyToken = (token: string): Promise<IJwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token, 
      process.env.JWT_SECRET_SEED || '',
      (err, decoded) => {
        if (err) reject(err);
        resolve(decoded as IJwtPayload);
      }
    );
  });
}
