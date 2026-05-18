import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Book } from './models/Book';
import BookModel from './models/BookModel';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/bookTracker')
    .then(() => console.log('MongoDB Connecté'))
    .catch(err => console.error(err));

app.post('/api/books', async (req, res) => {
    try {
        console.log('POST /api/books body:', req.body);
        const { title, author, pages, status, price, pagesRead, format, suggestedBy } = req.body;
        
        if (pagesRead > pages) {
            return res.status(400).json({ error: 'Pages lues ne peuvent pas dépasser le nombre total de pages' });
        }
        
        const book = new Book(title, author, pages, status, price, pagesRead, format, suggestedBy);
        const savedBook = await book.save();
        res.status(201).json(savedBook);
    } catch (error: any) {
        console.error("Erreur de validation Mongoose :", error);
        res.status(400).json({ error: error.message || 'Erreur lors de la création' });
    }
});

app.get('/api/books', async (req, res) => {
    const books = await BookModel.find();
    res.json(books);
});

app.get('/api/stats', async (req, res) => {
    const books = await BookModel.find();
    const totalRead = books.filter(b => b.finished).length;
    const totalPages = books.reduce((acc, b) => acc + b.pagesRead, 0);
    res.json({ totalRead, totalPages });
});

app.put('/api/books/:id/currentlyAt', async (req, res) => {
    try {
        const updatedBook = await Book.currentlyAt(req.params.id, req.body.pagesRead);
        res.json(updatedBook);
    } catch (error) { res.status(400).send('Erreur'); }
});

app.put('/api/books/:id/status', async (req, res) => {
    try {
        const updatedBook = await Book.changeStatus(req.params.id, req.body.status);
        res.json(updatedBook);
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Erreur lors du changement de statut' });
    }
});

app.put('/api/books/:id/finish', async (req, res) => {
    try {
        const finishedBook = await Book.markAsFinished(req.params.id);
        res.json(finishedBook);
    } catch (error) { res.status(400).send('Erreur'); }
});

app.delete('/api/books/:id', async (req, res) => {
    await Book.deleteBook(req.params.id);
    res.send({ message: 'Livre supprimé' });
});

app.listen(3000, () => console.log('Serveur sur http://localhost:3000'));