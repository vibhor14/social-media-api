const express = require("express");
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser=require('body-parser');



app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.json());

//connect to DB

mongoose.connect("mongodb+srv://admin-vibhor:atlas!$@cluster0.4glif.mongodb.net/Project02?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Mongoose Is Connected");
});

//import routes 
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
// routes-
app.use("/api/authenticate", authRoute);
app.use("/api", postRoute);

//-----------------------------
app.get("/",(req,res)=> {
    console.log("HERE");
    res.send("Welcome to social media");
})

app.listen(process.env.PORT||3000, () => {
    console.log("Server Has Started on port 3000");
});