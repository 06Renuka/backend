// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const UserSchema = new Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String
//     },
//     googleId: {
//         type: String
//     }
// });

// module.exports = User = mongoose.model('users', UserSchema);

const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    googleId: String
});

module.exports = mongoose.model('users', userSchema);


