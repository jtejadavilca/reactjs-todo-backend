
// CRUD note routes
const router = require('express').Router();
const { verifyToken } = require('../auth/jwt_util');
const Note = require('../models/noteModel');

// Get all notes
router.get('/', verifyToken, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.userId });
        res.json({
            message: 'Notes retrieved',
            data: notes,
            error: false
        });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true });
    }
});

// Get a note
const getNote = async (req, res, next) => {
    let note;
    try {
        note = await Note.findById(req.params.id, [], { user: req.user.userId });
        if (note == null) {
            return res.status(404).json({ message: 'Note not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.note = note;
    next();
};

router.get('/:id', verifyToken, getNote, async (req, res) => {
    res.json({
        message: 'Note retrieved',
        data: res.note,
        error: false
    });
});

// Create a note
router.post('/', verifyToken, async (req, res) => {
    const note = new Note({
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        isPinned: req.body.isPinned,
        user: req.user.userId
    });

    try {
        const newNote = await note.save();
        res.status(201).json({
            message: 'Note created',
            data: newNote,
            error: false
        });
    } catch (error) {
        res.status(400).json({ message: error.message, error: true });
    }
});

// Update a note
router.patch('/:id', verifyToken, getNote, async (req, res) => {
    if (req.body.title != null) {
        res.note.title = req.body.title;
    }

    if (req.body.content != null) {
        res.note.content = req.body.content;
    }

    if (req.body.tags != null) {
        res.note.tags = req.body.tags;
    }

    if (req.body.isPinned != null) {
        res.note.isPinned = req.body.isPinned;
    }

    try {
        const updatedNote = await res.note.save();
        res.json({
            message: 'Note updated',
            data: updatedNote,
            error: false
        });
    } catch (error) {
        res.status(400).json({ message: error.message, error: true });
    }
});

// Delete a note
router.delete('/:id', verifyToken, getNote, async (req, res) => {
    try {    
        const result = await Note.findByIdAndDelete(res.note._id, { user: req.user.userId });
        res.json({ message: 'Note deleted', data: result, error: false });
    } catch (error) {
        res.status(500).json({ message: error.message, error: true });
    }
});

// Pin note
router.patch('/:id/pin', verifyToken, getNote, async (req, res) => {
    res.note.isPinned = !res.note.isPinned;

    try {
        const updatedNote = await res.note.save();
        const {_id, isPinned} = updatedNote;
        res.json({
            message: 'Note pinned',
            data: { _id, isPinned },
            error: false
        });
    } catch (error) {
        res.status(400).json({ message: error.message, error: true });
    }
});

module.exports = router;