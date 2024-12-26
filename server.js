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


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/api/users', UserRoutes);
app.use('/api/games', GameRoutes);
app.use('/api/transactions', TransactionRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});


sequelize.sync().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
});
