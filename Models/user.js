const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
});

// Hash the password before saving the user model
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// Method to generate auth token
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    // Generate and return a token without storing it in the database
    const token = jwt.sign({ _id: user._id.toString() }, 'yourSecretKey', { expiresIn: '1h' });
    return token;
};

// Static method to find user by credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Incorrect password');
    }
    return user;
};


// Method to reset password
userSchema.statics.resetPassword = async (email, newPassword) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }
    user.password = newPassword;
    await user.save();
};

const User = mongoose.model('User', userSchema);
module.exports = User;



