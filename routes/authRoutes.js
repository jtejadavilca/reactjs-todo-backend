const bcrypt = require('bcrypt');
const router = require('express').Router();
const User = require('../models/userModel');
const { generateToken } = require('../auth/jwt_util');

// Create account (register)
router.post('/register', async (req, res) => {

    const { fullname, username, password } = req.body;
    const encryptedPassword = bcrypt.hashSync(password, 10);

    const user = new User({fullname, username, password: encryptedPassword});

    try {
        const newUser = await user.save();
        res.status(201).json({
            token: generateToken(newUser)
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Login
router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    const wrongCredentials = { message: 'Wrong credentials!', error: true};
    if (user == null) {
        return res.status(400).json(wrongCredentials);
    }

    if(!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(400).json(wrongCredentials);
    }

    res.json({
        token: generateToken(user)
    });
});

module.exports = router;