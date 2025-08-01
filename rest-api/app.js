const express = require('express');
require('dotenv').config();
const cors = require('cors');

//Import routes
const authRoutes = require('./routes/auth');
const mainRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

//Routes
app.use('/api/auth', authRoutes);
app.use('/', mainRoutes);

//Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    })
});

//404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        availableRoutes: {
            main: ['GET /', 'GET /login', 'GET /home'],
            auth: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me'],
            health: ['GET /health']
        }
    });
});

//Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error: ', err.message);

    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_DEV === 'development' ? err.message : 'Internal server error',
    });
});

//Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Available endpoints:`);
    console.log(`   GET  /                 - Root (redirects based on auth)`);
    console.log(`   GET  /login            - Login page`);
    console.log(`   GET  /home             - Home page (protected)`);
    console.log(`   POST /api/auth/register - Create user`);
    console.log(`   POST /api/auth/login   - Login`);
    console.log(`   GET  /api/auth/me      - Get current user (protected)`);
    console.log(`   GET  /health           - Health check`);
    console.log(`\n💡 Don't forget to set your JWT_SECRET in .env file!`);
});