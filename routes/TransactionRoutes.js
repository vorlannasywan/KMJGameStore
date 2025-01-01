import express from 'express';
import { createTransaction, getUserTransactions, getAllTransactions} from '../controllers/TransactionController.js';

const router = express.Router();

// Membuat transaksi (Pembelian Game)
router.post('/purchase', createTransaction);
router.get('/lib', getUserTransactions);
router.get('/all-transactions', getAllTransactions);

export default router;
