import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import mainRoutes from './routes/index.js';

dotenv.config();

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

// Test database connection on startup
async function testDatabaseConnection() {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');

        // Optional: Log database info
        const userCount = await prisma.user.count();
        console.log(`📊 Total users in database: ${userCount}`);
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

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
app.get('/health', async (req, res) => {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

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

// Start server
async function startServer() {
    try {
        // Test database connection first
        await testDatabaseConnection();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📋 Available endpoints:`);
            console.log(`   GET  /                 - Root (redirects based on auth)`);
            console.log(`   GET  /login            - Login page`);
            console.log(`   GET  /home             - Home page (protected)`);
            console.log(`   POST /api/auth/register - Create user`);
            console.log(`   POST /api/auth/login   - Login`);
            console.log(`   GET  /api/auth/me      - Get current user (protected)`);
            console.log(`   GET  /api/auth/users   - Get all users (protected)`);
            console.log(`   GET  /health           - Health check`);
            console.log(`\n💾 Database: SQLite with Prisma ORM`);
            console.log(`📁 Database file: ${process.env.DATABASE_URL}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();