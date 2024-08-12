const express = require('express');
const mongoose = require('./config/mongoose');
const userRouter = require('./routes/auth');
const User= require('./Models/user');

const app = express();
const port = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/auth', );

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api', userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
