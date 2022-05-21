const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require("mongoose");
const router = express.Router();

router.post("/", async (req,res)=>{
    //console.log(User.find());
    const userFound = await User.findOne({username: req.body.username});
    if(!userFound) {
        return res.status(400).send("Username not found");
    }
    // now check password
    const passwordCheck = (userFound.password===req.body.password);
    if(!passwordCheck){
        return res.status(400).send("Wrong Password.");
    } 
    //assign jwt-token
    const token = jwt.sign({_id: userFound._id},"somethingintheway");
    res.header("auth_token",token).send(token);

})

module.exports = router;