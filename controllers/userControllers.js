//import express
const express = require("express");

//import prisma client
const prisma = require("../prisma/client");

const { validationResult } = require("express-validator");

//import bcrypt
const bcrypt = require("bcryptjs");

//function findUsers
const allUsers = async (req, res) => {
    try {

        //get all users from database
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
            },
            orderBy: {
                id: "asc",
            },
        });

        //send response
        res.status(200).send({
            success: true,
            message: "Get all users successfully",
            data: users,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

const createUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
        //insert data
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            },
        });

        //return response json
        res.status(201).send({
            success: true,
            message: "Create User successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
        });
    }
};

const getUserbyId = async (req, res) => {
    console.log(`Params ${req}`);
    console.log(`Params ${req.params}`);
    const { id } = req.params;
    console.log(`Params ${id}`);
    try {
        // Cari user
        const user = await prisma.user.findFirst({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
            },
        });

        // Alternatif
        // const user = await prisma.user.findUnique({
        //     where: {
        //         id: Number(id),
        //     },
        //     select: {
        //         id: true,
        //         name: true,
        //         username: true,
        //         email: true,
        //     },
        // });

        if (!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).send({
            success: true,
            message: `User by ID ${id} found`,
            data: {
                user: user,
            }
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = { allUsers, createUser, getUserbyId };