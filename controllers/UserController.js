import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Game from '../models/Game.js';

// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isAdmin: isAdmin || false,
        });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login User
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find User by Email
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate Token
        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Login User (without token)
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find User by Email
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Login successful, return user data without token
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserLibrary = async (req, res) => {
    try {
        const userId = req.query.userId; // Ambil userId dari query string
        const transactions = await Transaction.findAll({
            where: { userId },
            include: {
                model: Game, // Relasi ke model Game
                attributes: ['title', 'description', 'price', 'image'], // Tentukan kolom yang diambil dari model Game
            },
        });

        if (!transactions.length) {
            return res.status(404).json({ message: 'No games found in your library' });
        }

        // Mapping hasil transaksi dan data Game
        const games = transactions.map(transaction => ({
            title: transaction.Game.title,
            description: transaction.Game.description,
            price: transaction.Game.price,
            imageUrl: transaction.Game.image, // Mengambil image URL
            paymentMethod: transaction.paymentMethod, // Mengambil metode pembayaran dari Transaction
        }));

        res.status(200).json(games); // Kirimkan data ke frontend
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
