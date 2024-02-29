const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
// const { findOne } = require("../models/contactModel");

//@desc Register a User
//@route POST /api/users/register
//@access Public

const registerUser = asyncHandler(async (req, res) => {
    console.log('Register user route hit!');
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("Please enter all fields");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already exists");
    } 
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("The hashed password is ", hashedPassword);
    
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });
    console.log(`User created ${user}`);
    if(user){
        res.status(201).json({
            _id: user.id,
            // username: user.username,
            email: user.email,
            message: "Register the user"
        });
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
    // res.json({
    //     message: "Register the user"
    // });
});

    // @desc Login a User
    // @route POST /api/users/login
    // @access Public
    const loginUser = asyncHandler(async (req,res) => {
        const { email , password } = req.body;
        if(!email || !password ){
            res.status(400);
            throw new Error("Please enter all fields");
        }
        const user = await User.findOne({email});
        if(user && (await bcrypt.compare(password, user.password))){
            const accessToken = jwt.sign({
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id
                }
            } , process.env.ACCESS_TOKEN_SECRET ,
            { expiresIn: "15m" })
           res.status(200).json({ accessToken })
        } else {
            res.status(401);
            throw new Error("Invalid credentials");
        }
    })

    // @desc Get Current User
    // @route GET /api/users/current
    // @access Private
    const getCurrentUser = asyncHandler(async (req,res) => {
        res.json({
            user: req.user
        });
    })

    module.exports = {registerUser , loginUser , getCurrentUser};