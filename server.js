import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/database.js';
import UserRoutes from './routes/UserRoutes.js';
import GameRoutes from './routes/GameRoutes.js';
import TransactionRoutes from './routes/TransactionRoutes.js';
import cors from 'cors';




dotenv.config();
const app = express();

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors());
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Routes
app.use('/api/users', UserRoutes);
app.use('/api/games', GameRoutes);
app.use('/api/transactions', TransactionRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Sync Database and Start Server
sequelize.sync().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
});
