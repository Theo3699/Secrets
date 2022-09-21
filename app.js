//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB");

const secret = process.env.SECRET;

const userSchema = mongoose.Schema({
    username: String,
    password: String
});


const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
})

app.get("/register", function(req, res){
    res.render("register");
})

app.get("/login", function(req, res){
    res.render("login");
})


app.post("/register", function(req, res){
    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            username: req.body.username,
            password: hash
        });
        newUser.save(function(err){
            if (err){
                console.log(err);
            }else{
                res.render("secrets");
            }
        });
    });
})

app.post("/login", function(req, res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    User.findOne({username: user.username}, function(err, foundUser){
        if (err){
            console.log(err);
        } else {
            if(foundUser) {
                //check if the password from the request matches the one in the db
                bcrypt.compare(user.password, foundUser.password, function(err, result) {
                    if (result){
                        res.render("secrets");
                    }
                });
            }
            else{
                console.log("Wrong credentials");
            }
        }
    });
})

app.listen(3000, function(){
    console.log("Server running on port 3000");
})