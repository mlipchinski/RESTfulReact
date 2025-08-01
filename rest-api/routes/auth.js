const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth')

//In memory users
const users = [];

//Helper function for JWT token generation
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

//User router
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        //Validation
        if (!username || !password) {
            return res.status(400).json({
                error: 'Username and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password length must be longer than 6 characters'
            });
        }

        //Check if users exists
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            return res.status(400).json({
                error: 'User already exists'
            })
        }

        //Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //Create the user
        const newUser = {
            id: users.length + 1,
            username,
            password: hashedPassword,
            createdAt: new Date()
        };

        users.push(newUser);

        //Generate token
        const token = generateToken(newUser);

        res.status(200).json({
            message: 'User create successfully',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                createdAt: newUser.createdAt,
            }
        });
    } catch (error) {
        console.error('Registration error: ', error);
        res.status(500).json({
            error: 'Internal server error'
        });

    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        //Validation
        if (!username || !password) {
            return res.status(400).json({
                error: 'Username and password required',
                
            });
        }

        //Find user
        const user = users.find(user => user.username === username);
        if (!user) {
            return res.status(400).json({
                error: 'Invalid credentials'
            })
        }

        //Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({
                error: 'Invalid password'
            });
        }

        //Generate token
        const token = generateToken(user);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Login error: ', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
    
});

router.get('/me', authenticateToken, (req, res) => {
    const user = users.find(user => user.id === req.user.id);

    if (!user) {
        return res.status(400).json({
            error: 'User not found'
        });
    }

    res.status(200).json(
        {
            user: {
                id: user.id,
                username: user.username,
                createdAt: user.createdAt,
            }
        }
    )
});

module.exports = router;