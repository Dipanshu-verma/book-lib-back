const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

 
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

 
router.post('/seed', async (req, res) => {
  try {
    const books = [
      {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt & David Thomas",
        coverImage: "https://placehold.co/300x300/FF5733/FFFFFF?text=The+Pragmatic+Programmer",
        availability: true
      },
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        coverImage: "https://placehold.co/300x300/3498DB/FFFFFF?text=Clean+Code",
        availability: true
      },
      {
        title: "Design Patterns",
        author: "Gang of Four",
        coverImage: "https://placehold.co/300x300/1ABC9C/FFFFFF?text=Design+Patterns",
        availability: true
      },
      {
        title: "Refactoring",
        author: "Martin Fowler",
        coverImage: "https://placehold.co/300x300/F39C12/FFFFFF?text=Refactoring",
        availability: true
      }
    ];

    await Book.deleteMany({});
    const createdBooks = await Book.insertMany(books);
    res.json({ message: 'Books seeded successfully', books: createdBooks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;