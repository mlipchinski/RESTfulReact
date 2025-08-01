const express = require('express');
const { authenticateToken, optionalAuth } = require('../middleware/auth')
const router = express.Router();

//Root route - redirects to login if not authenticated, home if authenticated
router.get('/', optionalAuth, (req, res) => {
    if (req.user) {
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
router.get('/home', authenticateToken, (req, res) => {
    res.json({
        message: 'Welcome to the home page!', 
        page: 'home',
        user: {
            id: req.user.id,
            username: req.user.username,            
        },
        timestamp: new Date().toISOString(),
    });
});

module.exports = router;