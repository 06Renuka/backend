// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const mongoose = require('mongoose');
// const User = mongoose.model('users');

// module.exports = function(passport) {
//     passport.use(
//         new GoogleStrategy({
//             clientID: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//             callbackURL: '/api/auth/google/callback'
//         }, (accessToken, refreshToken, profile, done) => {
//             User.findOne({ googleId: profile.id }).then(user => {
//                 if (user) {
//                     done(null, user);
//                 } else {
//                     new User({
//                         googleId: profile.id,
//                         name: profile.displayName,
//                         email: profile.emails[0].value
//                     }).save().then(user => done(null, user));
//                 }
//             });
//         })
//     );

//     passport.serializeUser((user, done) => {
//         done(null, user.id);
//     });

//     passport.deserializeUser((id, done) => {
//         User.findById(id, (err, user) => {
//             done(err, user);
//         });
//     });
// };

// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/User'); // Correct path to the User model

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:5000/auth/google/callback"
// }, async (token, tokenSecret, profile, done) => {
//     let user = await User.findOne({ googleId: profile.id });

//     if (!user) {
//         user = await User.create({
//             name: profile.displayName,
//             email: profile.emails[0].value,
//             googleId: profile.id
//         });
//     }

//     return done(null, user);
// }));

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//     const user = await User.findById(id);
//     done(null, user);
// });

// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const mongoose = require('mongoose');
// const User = mongoose.model('user');

// module.exports = (passport) => {
//     passport.use(new GoogleStrategy({
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: "http://localhost:5000/auth/google/callback"
//     },
//     (accessToken, refreshToken, profile, done) => {
//         User.findOne({ googleId: profile.id }).then((existingUser) => {
//             if (existingUser) {
//                 done(null, existingUser);
//             } else {
//                 new User({ googleId: profile.id, name: profile.displayName, email: profile.emails[0].value })
//                     .save()
//                     .then(user => done(null, user));
//             }
//         });
//     }));

//     passport.serializeUser((user, done) => {
//         done(null, user.id);
//     });

//     passport.deserializeUser((id, done) => {
//         User.findById(id).then(user => done(null, user));
//     });
// };
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
// const User = mongoose.model('users');
const User = require('../models/User');

module.exports = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id }).then((existingUser) => {
            if (existingUser) {
                done(null, existingUser);
            } else {
                new User({ googleId: profile.id, name: profile.displayName, email: profile.emails[0].value })
                    .save()
                    .then(user => done(null, user));
            }
        });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => done(null, user));
    });
};
