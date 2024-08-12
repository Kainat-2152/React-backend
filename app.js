// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/auth');

const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://127.0.0.1:27017/auth-system', {
    
    // useCreateIndex: true,
    // useFindAndModify: true
});

app.use(cors());

app.use(bodyParser.json());
app.use(userRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
