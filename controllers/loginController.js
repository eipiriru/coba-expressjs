const express = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma/client");

const login = async (req, res) => {
    // Cek Validasi data
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }

    try {
        // Cari user
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    {username: req.body.email},
                    {email: req.body.email}
                ]
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                password: true,
            },
        });

        if (!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Cek password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (!validPassword){
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            })
        }

        // Generate Token JWT
        const tokenjwt = jwt.sign({ id: user.id}, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // remove password from object
        const { password, ...userWithoutPassword } = user;

        res.status(200).send({
            success: true,
            message: "Login Successfully",
            data: {
                user: userWithoutPassword,
                token: tokenjwt,
            }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = { login };