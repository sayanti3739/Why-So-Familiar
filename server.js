const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.AZURE_COSMOS_CONNECTIONSTRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

// Backend routes
app.use('/api', require('./backend/routes/api'));
app.use('/auth', require('./backend/routes/auth'));

// Serve frontend pages 
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 4300;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
