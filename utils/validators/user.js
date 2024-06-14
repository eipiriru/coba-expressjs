//import express validator
const { body } = require('express-validator');

//import prisma
const prisma = require('../../prisma/client');

// Definisikan validasi untuk create user
const validateUser = [
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

const validateUpdateAllData = [
    body('name').notEmpty().withMessage('Name is required'),
    body('username').notEmpty().withMessage('Username is required.')
        .custom(async (value, { req }) => {
            if (!value){
                throw new Error('Username is required');
            }
            // const user = await prisma.user.findUnique({ where: { username: value } });
            const user = await prisma.user.findFirst({ where: { OR: [{username: value},{email: value}] } })
            if (user && user.id !== Number(req.params.id)) {
                throw new Error('Username already exists');
            }
            return true;
        }),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email is invalid')
        .custom(async (value, { req }) => {
            if (!value) {
                throw new Error('Email is required');
            }
            // const user = await prisma.user.findUnique({ where: { email: value } });
            const user = await prisma.user.findFirst({ where: { OR: [{username: value},{email: value}] } })
            if (user && user.id !== Number(req.params.id)) {
                throw new Error('Username already exists');
            }
            return true;
        }),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateUpdatePartialData = [
    body('username').custom(async (value, { req }) => {
            // const user = await prisma.user.findUnique({ where: { username: value } });
            const user = await prisma.user.findFirst({ where: { OR: [{username: value},{email: value}] } })
            if (user && user.id !== Number(req.params.id)) {
                throw new Error('Username already exists');
            }
            return true;
        }),
    body('email')
        .optional()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Email is invalid')
        .custom(async (value, { req }) => {
            // const user = await prisma.user.findUnique({ where: { email: value } });
            const user = await prisma.user.findFirst({ where: { OR: [{username: value},{email: value}] } })
            if (user && user.id !== Number(req.params.id)) {
                throw new Error('Username already exists');
            }
            return true;
        }),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const cekID = async (req, res, next) => {
    let id = Number(req.params.id);
    const user = await prisma.user.findFirst({ where: {id: id} })
    if (!user) return res.status(401).json({ success: false, message: 'User Not Found.' });
}

module.exports = { validateUser, validateUpdateAllData, validateUpdatePartialData, cekID }