require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);

app.get("/", function (req, res){
    res.render("home");
});

app.get("/login", function (req, res){
    res.render("login");
});

app.get("/register", function (req, res){
    res.render("register");
});

app.post("/register", function (req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(function(err){
            if (err) console.log(err);
            else res.render("secrets");
        });
    });
    
});

app.post("/login", function (req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, function (err, found){
        if(err) console.log(err);
        else{
            if(found){
                bcrypt.compare(password, found.password, function (err, exists){
                    if(exists){
                        res.render("secrets");
                    }else{
                        res.send("Wrong credentials.");
                    }
                });
            }else res.send("User not found");
        }
    })
})
let port = process.env.PORT;
if(port==null) port = 3000;
app.listen(port, function (err){
    if(!err){
        console.log("Server started at "+ port);
    }else console.log(err);
});