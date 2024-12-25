import express from 'express';
import { createGame, getAllGames, getGamesByYear, getGameById, updateGame, deleteGame, uploadGameImage } from '../controllers/GameController.js';
import { authenticate, authorizeAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Use the image upload middleware before calling createGame
router.post('/', authenticate, authorizeAdmin, uploadGameImage, createGame);

// Route to get all games
router.get('/', getAllGames);

// Route to get a game by ID
router.get('/:id', getGameById);

// Route to update an existing game (only admin can update)
router.put('/:id', authenticate, authorizeAdmin, uploadGameImage, updateGame);

// Route to delete a game by ID (only admin can delete)
router.delete('/:id', authenticate, authorizeAdmin, deleteGame);

router.get('/releaseYear', getGamesByYear); 

export default router;
