//import express validator
const { body } = require('express-validator');

//import prisma
const prisma = require('../../prisma/client');

// validasi untuk register
const validateRegister = [
    body('name').notEmpty().withMessage('Name is required'),
    body('username').notEmpty().withMessage('Username is required.')
        .custom(async (value) => {
            if (!value){
                throw new Error('Username is required');
            }
            // const user = await prisma.user.findUnique({ where: { username: value } });
            const user = await prisma.user.findFirst({ where: { OR: [{username: value},{email: value}] } })
            if (user) {
                throw new Error('Username already exist');
            }
            return true;
        }),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email is invalid')
        .custom(async (value) => {
            if (!value) {
                throw new Error('Email is required');
            }
            // const user = await prisma.user.findUnique({ where: { email: value } });
            const user = await prisma.user.findFirst({ where: { OR: [{username: value},{email: value}] } })
            if (user) {
                throw new Error('Email already exists');
            }
            return true;
        }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

//definisikan validasi untuk login
const validateLogin = [
    body('email').notEmpty().withMessage('Email or Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { validateRegister, validateLogin };