const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contacts');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);

// Healthcheck
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Contact API' }));

// Error handler (should be last)
app.use(errorHandler);

module.exports = app;