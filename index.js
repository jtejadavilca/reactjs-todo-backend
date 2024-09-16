require('dotenv').config();
const config = require('./config.json');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:5173'}));

app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

mongoose.connect(config.connectionString)
.then(() => {
    console.log('Connected to MongoDB');
});



const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
