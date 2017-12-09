var jwt = require('jsonwebtoken');  
var User = require('../models/user');
var authConfig = require('../config/auth');

//Generates the current session's JSON Web Token
function generateToken(user){
    return jwt.sign(user, authConfig.secret, {
        expiresIn: 10080
    });
}
 
//Sets the user info to be retrieved later when a successful write to the database has been made.
function setUserInfo(request){
    return {
        _id: request._id,
        email: request.email,
        
    }
}
 //Function responsible for logging in the user.
exports.login = function(req, res, next){
    
    var userInfo = setUserInfo(req.user);
 
    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
 
}
//Function responsible for Registering users.
exports.register = function(req, res, next){
 
    var email = req.body.email;
    var password = req.body.password;

    
    //Checks if the user has entered an email.
    if(!email){
        return res.status(422).send({error: 'You must enter an email address'});
    }
    //Checks to see if the user has entered an email in the "x@y.z" format
    var checkEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!checkEmail.test(email)) {
        return res.status(422).send({error: 'Email is not valid'});
    }
    //Checks to see if the user has entered a password
    if(!password){
        return res.status(422).send({error: 'You must enter a password'});
    }
    //Finds the User if all the above conditions have been met.
    User.findOne({email: email}, function(err, existingUser){
        //If there is an error in finding one user with the email returns.
        if(err){
            return next(err);
        }
        //If the user already exists, returns a message to say so.
        if(existingUser){
            return res.status(422).send({error: 'That email address is already in use'});
        }
        //Calls the Constructor for the User Model, which requires a username and password.
        var user = new User({
            email: email,
            password: password,
           
        });
        //Calls the User Model's pre('save') function and returns 
        user.save(function(err, user){
 
            if(err){
                return next(err);
            }

            var userInfo = setUserInfo(user);
 
            res.status(201).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            });
 
        });
 
    });
 
}