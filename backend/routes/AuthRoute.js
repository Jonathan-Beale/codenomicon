const User = require("../models/UserModel");
const {createToken} = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const app = require("express").Router();

app.post("/signup", async (req, res) => {
    try {
        const {email, password} = req.body;
        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.json({message: "User already exists."});
        }
        const user = await User.create({email, password});
        const token = createToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201).json({message: "User is signed in.", success: true, user});
    } catch (error) {
        console.error(error);
    }
});

app.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password){
            return res.json({message:"Email and Password Required."})
        }
        const user = await User.findOne({email});
        if (!user){
            return res.json({message:"Incorrect Email."}) 
        }
        const auth = await bcrypt.compare(password,user.password)
        if (!auth){
            return res.json({message:"Incorrect Password."}) 
        }
        const token = createToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201).json({message: "User is logged in.", success: true});
    } catch (error) {
        console.error(error);
    }
});

app.post("/", (req, res) => {
    const token = req.cookies.token;
    if (!token){
        return res.json({status: false});
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err){
            return res.json({status: false});
        } else {
            const user = await User.findById(data.id);
            if (user){
                return res.json({status: true});
            }
            else {
                return res.json({status: false});
            }
        }
    });
});

module.exports = app;