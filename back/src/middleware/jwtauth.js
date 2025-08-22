import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
const JWT_SECRET = process.env.JWT_SECRET;
export function authVerify(req, res, next) {
    try {
        const token =req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
        if (!token) {
            return next(errorHandler(401, 'Authentication token is required'));
        }
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return next(errorHandler(401, 'Token expired'));
                }
                return next(errorHandler(401, 'Invalid token'));
            }
            else {
                req.user = user;
                next();
            }
        });
    } catch (error) {
        return next(errorHandler(500, 'Internal server error'));
    }

}