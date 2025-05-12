const express = require('express');
const router = express.Router();
const MyBook = require('../models/MyBook');
const Book = require('../models/Book');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Get user's books
router.get('/', async (req, res) => {
  try {
    const myBooks = await MyBook.find({ userId: req.userId })
      .populate('bookId')
      .sort('-createdAt');
    res.json(myBooks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add book to user's list
router.post('/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if already in user's list
    const existingEntry = await MyBook.findOne({ 
      userId: req.userId, 
      bookId 
    });
    
    if (existingEntry) {
      return res.status(400).json({ message: 'Book already in your list' });
    }

    // Add to user's list
    const myBook = new MyBook({
      userId: req.userId,
      bookId,
      status: 'Want to Read'
    });

    await myBook.save();
    const populated = await MyBook.findById(myBook._id).populate('bookId');
    
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update reading status
router.patch('/:bookId/status', async (req, res) => {
  try {
    const { bookId } = req.params;
    const { status } = req.body;

    const myBook = await MyBook.findOneAndUpdate(
      { userId: req.userId, bookId },
      { status },
      { new: true }
    ).populate('bookId');

    if (!myBook) {
      return res.status(404).json({ message: 'Book not found in your list' });
    }

    res.json(myBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update rating
router.patch('/:bookId/rating', async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating } = req.body;

    const myBook = await MyBook.findOneAndUpdate(
      { userId: req.userId, bookId },
      { rating },
      { new: true }
    ).populate('bookId');

    if (!myBook) {
      return res.status(404).json({ message: 'Book not found in your list' });
    }

    res.json(myBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;