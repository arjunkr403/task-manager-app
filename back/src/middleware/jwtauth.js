import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
export function authVerify(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Token expired' });
                }
                return res.status(403).json({ message: 'Invalid token' });
            }
            else {
                req.user = user;
                next();
            }
        });
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}