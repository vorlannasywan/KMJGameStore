import express from 'express';
import { createTransaction, getUserTransactions} from '../controllers/TransactionController.js';

const router = express.Router();

// Membuat transaksi (Pembelian Game)
router.post('/purchase', createTransaction);
router.get('/lib', getUserTransactions);

export default router;
