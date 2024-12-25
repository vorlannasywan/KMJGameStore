import Game from '../models/Game.js';
import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/'); // Folder untuk menyimpan gambar
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Menggunakan timestamp untuk nama file unik
    }
});

const upload = multer({ storage: storage });

export const createGame = async (req, res) => {
    try {
        const { title, price, releaseYear, description, genre, developer, publisher } = req.body;

        // Pastikan gambar ada di request
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const imageUrl = `/uploads/${req.file.filename}`; // URL gambar untuk disimpan di database

        const game = await Game.create({
            title,
            price,
            releaseYear,
            description,
            genre,
            developer,
            publisher,
            image: imageUrl
        });

        res.status(201).json({ message: 'Game created successfully', game });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllGames = async (req, res) => {
    try {
        const games = await Game.findAll();
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getGameById = async (req, res) => {
    try {
        const game = await Game.findByPk(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getGamesByGenre = async (req, res) => {
    try {
        const { genre } = req.query;
        const games = await Game.findAll({ where: { genre } });

        if (games.length === 0) {
            return res.status(404).json({ message: 'No games found for the specified genre' });
        }

        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getGamesByYear = async (req, res) => {
    try {
        const { releaseYear } = req.query;
        const games = await Game.findAll({ where: { releaseYear } });

        if (games.length === 0) {
            return res.status(404).json({ message: 'No games found for the specified release year' });
        }

        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const searchGames = async (req, res) => {
    try {
        const { page = 1, limit = 10, genre, releaseYear } = req.query;
        const where = {};

        if (genre) {
            where.genre = genre;
        }

        if (releaseYear) {
            where.releaseYear = releaseYear;
        }

        const games = await Game.findAndCountAll({
            where,
            limit,
            offset: (page - 1) * limit,
        });

        res.status(200).json({
            total: games.count,
            totalPages: Math.ceil(games.count / limit),
            currentPage: page,
            games: games.rows,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateGame = async (req, res) => {
    try {
        const game = await Game.findByPk(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        const { title, price, releaseYear, description, genre, developer, publisher } = req.body;
        let imageUrl = game.image;

        // Jika gambar baru ada, ganti gambar
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        await game.update({ title, price, releaseYear, description, genre, developer, publisher, image: imageUrl });

        res.status(200).json({ message: 'Game updated successfully', game });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const deleteGame = async (req, res) => {
    try {
        const game = await Game.findByPk(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        await game.destroy();
        res.status(200).json({ message: 'Game deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const uploadGameImage = upload.single('image'); 