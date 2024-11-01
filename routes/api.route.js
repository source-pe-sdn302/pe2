const express = require("express");
const db = require("../models");


const ApiRouter = express.Router();

// Create user
ApiRouter.post("/create", async (req, res, next) => {
    try {
        const { gmail, password, name, phone, address, role } = req.body;
        const newUser = await db.User.create({ gmail, password, name, phone, address, role });
        //Insert one
        await newUser.save().then(newDoc => {
            res.status(201).json({
                message: "User created successfully",
                result: {
                    userCode: newDoc._id,
                    gmail: newDoc.gmail,
                    password: newDoc.password,
                    name: newDoc.name,
                    phone: newDoc.phone,
                    address: newDoc.address,
                    role: newDoc.role
                }
            });
        });
    } catch (error) {
        res.status(500).json({
            error: {
                status: 500,
                message: error.message
            }
        })
    }
});

module.exports = ApiRouter;
