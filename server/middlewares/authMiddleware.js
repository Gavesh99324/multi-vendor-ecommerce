import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const protect = async (req, res, next) => {
const auth = req.headers.authorization || '';
if (!auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authorized' });
try {
const token = auth.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
const user = await User.findById(decoded.id);
if (!user || !user.isActive) return res.status(401).json({ message: 'User inactive' });
req.user = { id: user._id.toString(), role: user.role };
next();
} catch (e) {
return res.status(401).json({ message: 'Token invalid' });
}
};


export const authorize = (...roles) => (req, res, next) => {
if (!req.user || !roles.includes(req.user.role)) {
return res.status(403).json({ message: 'Forbidden' });
}
next();
};