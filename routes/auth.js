const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

// Register User
// router.post('/register', (req, res) => {
//     const { name, email, password } = req.body;
//     User.findOne({ email }).then(user => {
//         if (user) {
//             return res.status(400).json({ email: 'Email already exists' });
//         } else {
//             const newUser = new User({ name, email, password });
//             bcrypt.genSalt(10, (err, salt) => {
//                 bcrypt.hash(newUser.password, salt, (err, hash) => {
//                     if (err) throw err;
//                     newUser.password = hash;
//                     newUser.save()
//                         .then(user => res.json(user))
//                         .catch(err => console.log(err));
//                 });
//             });
//         }
//     });
// });

// // Login User
// router.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     User.findOne({ email }).then(user => {
//         if (!user) {
//             return res.status(404).json({ email: 'User not found' });
//         }
//         bcrypt.compare(password, user.password).then(isMatch => {
//             if (isMatch) {
//                 const payload = { id: user.id, name: user.name };
//                 jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
//                     res.json({ success: true, token: 'Bearer ' + token });
//                 });
//             } else {
//                 return res.status(400).json({ password: 'Password incorrect' });
//             }
//         });
//     });
// });
router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    User.findOne({ email })
        .then(user => {
            if (user) {
                return res.status(400).json({ email: 'Email id already exists' });
            } else {
                const newUser = new User({ name, email, password });
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw err;
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json({ success: true, user }))
                            .catch(err => console.log(err));
                    });
                });
            }
        })
        .catch(err => res.status(500).json({ error: 'Server error' }));
});

// Login User
router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ email: 'User not found' });
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = { id: user.id, name: user.name };
                        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
                            if (err) throw err;
                            res.json({ success: true, token: 'Bearer ' + token });
                        });
                    } else {
                        return res.status(400).json({ password: 'Password incorrect' });
                    }
                })
                .catch(err => res.status(500).json({ error: 'Server error' }));
        })
        .catch(err => res.status(500).json({ error: 'Server error' }));
});





function generateToken(user) {
    const payload = { id: user.id, name: user.name };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 });
}

// Google Auth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/courses');
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
