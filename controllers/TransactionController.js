import Transaction from '../models/Transaction.js';
import User from '../models/User.js';
import Game from '../models/Game.js';

export const createTransaction = async (req, res) => {
    try {
        const { userId, gameId, paymentMethod } = req.body;

        // Pastikan user sudah login (userId harus ada)
        if (!userId) {
            return res.status(401).json({ message: 'User not logged in' });
        }

        // Verifikasi apakah user ada
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verifikasi apakah game ada
        const game = await Game.findByPk(gameId);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Verifikasi metode pembayaran
        const validPaymentMethods = ['credit-card', 'paypal', 'bank-transfer'];
        if (!validPaymentMethods.includes(paymentMethod)) {
            return res.status(400).json({ message: 'Invalid payment method' });
        }

        // Create the transaction
        const transaction = await Transaction.create({
            userId,
            gameId,
            paymentMethod, // Store payment method
        });

        res.status(201).json({ message: 'Purchase successful', transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserTransactions = async (req, res) => {
    try {
        const { userId } = req.query;  // Ensure userId is received from the query

        console.log('Fetching transactions for user ID:', userId);  // Add logging here

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Fetch transactions from database
        const transactions = await Transaction.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    attributes: ['name', 'email'],  // Include user data
                },
                {
                    model: Game,
                    attributes: ['title', 'description', 'price', 'image'],  // Include game data
                },
            ],
        });

        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found for this user' });
        }

        res.status(200).json(transactions);  // Return transactions data
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

