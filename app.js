require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const encrypt = require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.KEY, encryptedFields: ["password"]});

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
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if (err) console.log(err);
        else res.render("secrets");
    });
});

app.post("/login", function (req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, function (err, found){
        if(err) console.log(err);
        else{
            if(found){
                if(found.password !== password){
                    res.send("Wrong credentials.");
                }else {
                    res.render("secrets");
                }
            }else console.log("User not found");
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