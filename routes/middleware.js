const jwt = require("jsonwebtoken");

module.exports = function (req,res,next){
    const token = req.header('auth_token');
    //console.log(token);
    if(!token) res.status(401).send("FORBIDDEN !!");

    try{
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user = verified;
        //console.log(verified);
        next();
    }catch (err){
        res.status(400).send("Token invalid");
    }
}