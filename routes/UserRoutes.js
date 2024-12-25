import express from 'express';
import { registerUser, loginAdmin, loginUser, getUserLibrary } from '../controllers/UserController.js';
const router = express.Router();

// User Routes
router.post('/register', registerUser);
router.post('/loginadmin', loginAdmin);
router.post('/login', loginUser); 
router.post('/library', getUserLibrary); 

export default router;
