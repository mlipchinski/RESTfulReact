import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import userService from '../services/userService.js';

const router = express.Router();

//Root route - redirects to login if not authenticated, home if authenticated
router.get('/', optionalAuth, async (req, res) => {
    if (req.user) {
        const user = await userService.findUserById(req.user.id);

        // User is authenticated, redirect to home
        res.json({
            message: 'Redirecting to home',
            authenticated: true,
            redirect: '/home',
            user: {
                id: req.user.id,
                username: req.user.username,
            }
        });
    } else {
        //User is not auth, redirect to login
        res.json({
            message: 'Redirect to login',
            authenticated: false,
            redirect: '/login',
        })
    }
});

router.get('/login', (req, res) => {
    res.json({
        message: 'Login page',
        page: 'login',
        instructions: {
            register: 'POST /api/auth/register with {username, password}',
            login: 'POST /api/auth/login with {username, password}'
        }
    })
});

//Home page
router.get('/home', authenticateToken, async (req, res) => {
    try {
        const user = await userService.findUserById(req.user.id);

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.json({
            message: 'Welcome to the home page!',
            page: 'home',
            user: {
                id: req.user.id,
                username: req.user.username,
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Home route error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }

});

export default router;