//jshint esversion:6
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const { Schema } = mongoose;
require('dotenv').config()

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const newUser = new Schema({
    email: String,
    password: String
});


const secret = process.env.SECRET_KEY;
newUser.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = mongoose.model("User", newUser);


app.get("/", (req,res) =>{
    res.render("home");
});

app.get("/login", (req,res) =>{
    res.render("login")
});

app.post("/login", async (req,res) =>{

    const username = req.body.username;
    const password = req.body.password;

    const user = await User.findOne({email: username});
    try{
        if(user && user.password === password){
            res.render("secrets");
        }else{
            console.log("error")
        }
    }
    catch(error){
        console.log(error);
    }
});

app.get("/register", (req,res) =>{
    res.render("register");
});

app.post("/register", (req,res) =>{
   const username = req.body.username;
   const password = req.body.password;

   const newUser = new User({
    email: username,
    password: password
   });

   newUser.save();
   res.render("home");

});

app.listen("3000", (req,res) =>{
    console.log("Listening on port 3000");
});