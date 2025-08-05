import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/auth.js';
import userService from '../services/userService.js';

const router = express.Router();

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

        //Create using prisma orm
        const newUser = await userService.createUser({ username, password });

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
        // const user = users.find(user => user.username === username);
        const user = await userService.findUserByUsername(username);
        if (!user) {
            return res.status(400).json({
                error: 'Invalid credentials'
            })
        }


        //Check password
        //const isValidPassword = await bcrypt.compare(password, user.password);
        const isValidPassword = await userService.verifyUserPassowrd(password, user.password);
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
    //const user = users.find(user => user.id === req.user.id);
    const user = userService.findUserById(req.user.id);

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

export default router;