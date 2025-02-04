const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/authRoute');

const app = express();

app.listen(5000, () => {
    console.log('Server started on port 5000')
})




mongoose.connect('mongodb://localhost:27017/empdatabase')
    .then(() => {
        console.log('MongoDB Connection Successful');
    }).catch((error) => {
        console.log('DB Connection Error:', error);
    });

app.use(express.json());
app.use('/api/users', authRoute);