import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    // Memeriksa format token: Bearer <token>
    const bearerToken = token.split(' ')[1];  // Mengambil token dari header Authorization

    if (!bearerToken) {
        return res.status(401).json({ message: 'Token format is incorrect' });
    }

    try {
        // Verifikasi token menggunakan secret key
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
        req.user = decoded; // Simpan informasi user ke req.user
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export const authorizeAdmin = (req, res, next) => {
    // Pastikan user sudah didekode dari token dan memiliki hak akses admin
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Admins only' });
    }
    next();
};
