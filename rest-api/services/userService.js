import bcrypt from 'bcryptjs';
import prisma from '../db/index.js';

const createUser = async (userData) => {
    const { username, password } = userData;

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
        throw new Error('Username already exists!');
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
        },
        select: {
            id: true,
            username: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return user;

}

const hashedPassword = async (password) => {
    //Hash password
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

const findUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            createdAt: true,
            updatedAt: true,
            // Don't select password
        },
    });
}

const findUserByUsername = async (username) => {
    return await prisma.user.findUnique({
        where: { username },
        select: {
            id: true,
            username: true,
            createdAt: true,
            updatedAt: true,
            // Don't select password
        }
    })
}

//Verify password
const verifyUserPassowrd = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

const getAllUsers = async (skip = 0, take = 10) => {
    return await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            createdAt: true,
            updatedAt: true,
        },
        skip,
        take,
        orderBy: {
            createdAt: 'desc',
        }
    })
}

const getUserCount = async () => {
    return await prisma.user.count();
}

const updateUser = async (id, updateData) => {
    const { password, ...otherData } = updateData;

    let dataToUpdate = { ...otherData };

    if (password) {
        const saltRounds = 10;
        dataToUpdate.password = await bcrypt.hash(password, saltRounds);
    }

    return await prisma.user.update({
        where: {
            id
        },
        data: dataToUpdate,
        select: {
            id: true,
            username: true,
            createdAt: true,
            updatedAt: true,
        }
    })
}

const deleteUser = async (id) => {
    return await prisma.user.delete({
        where: { id },
        select: {
            id: true,
            username: true,
        },
    });
}


export default {
    createUser,
    findUserById,
    findUserByUsername,
    verifyUserPassowrd,
    getAllUsers,
    getUserCount,
    updateUser,
    deleteUser,
    hashedPassword,
};