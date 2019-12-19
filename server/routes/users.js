const express = require('express');
const router = express.Router();
var models  = require('../models');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const {ensureAuthenticated} = require('./../auth/auth');



router.post('/register', (req, res)=>{
    const { name, email, password, password2 } = req.body;
    let errors = [];




    
    //check required fields
    if(!name || !email || !password || !password2
        ||  name == undefined || email == undefined || password == undefined || password2 == undefined) {
        errors.push('Please fill in all fields.');
        return res.status(400).send({
            message: errors
        });
    }
    
    //check passwords match
    if(password !== password2){
        errors.push('Passwords do not match.');
        
    }

    //check pass length
    if(password.length < 6){
        errors.push('Password should be at least 6 characters.');
    }
    
    if(errors.length > 0){
        return res.status(400).send({
            message: errors
        });
    }
    else{
        models.User.findOne({ where: {email} }).then(user => {
            if(user){
                errors.push('Email is already registered');
                return res.status(400).send({
                    message: errors
                });
            }
            else{

                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(password, salt, (err, hash) =>{
                        if(err) throw err;
                        //save user
                        models.User.create({
                            name,
                            email,
                            password: hash
                          }).then(function(user) {

                            
                            req.login(user, (err) => {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).send({message:err}); 
                                }
                                return res.send({
                                    message: 'you have successfully registered.',
                                    email: email,
                                    name: name
                                });
                            });

                            

                            

                            
                          });
                    }));

               
            }
          })
        
    }
});

router.post('/login', (req, res, next) => {
passport.authenticate('local', (err, user, info) => {
    if (err) {
         return next(err); 
    }
    if(!user){
        return res.status(400).send(info.message)
    }
    req.login(user, (err) => {
        if (err) {
            return next(err); 
        }
        return res.send({
            message: 'you have logged in.',
            email:user.dataValues.email,
            name: user.dataValues.name
        });
    });
})(req, res, next);
});

router.post('/logout', (req, res, next) => {
    req.logout();
    return res.send({message: 'you have logged out.'});;
});

router.get('/usernameandemail', ensureAuthenticated, (req, res)=> {
    try {
        res.send({email: req.user.dataValues.email, name: req.user.dataValues.name});
      } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
      }
});




module.exports = router;

