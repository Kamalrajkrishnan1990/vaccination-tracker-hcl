const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
mongoose.connect('mongodb://localhost:27017/vaccine-tracker')
  .then(() => console.log('MongoDB connected locally!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/vaccines', require('./routes/vaccines'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/messages', require('./routes/messages'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));