const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
var models  = require('../models');

module.exports = function(passport) {
    // configure passport.js to use the local strategy
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        (email, password, done) => {
        models.User.findOne({ where: {email} })
            .then(User => {
                
                if (User == null) {
                    return done(null, false, { message: 'Invalid credentials.\n' });
                }

                bcrypt.compare(password, User.dataValues.password, (err, isMatch)=>{
                    if(err) throw err;
                    if(isMatch) {
                        return done(null, User);
                    }else{
                        return done(null, false, {message: 'Password incorrect.'})
                    }
                });
            })
        .catch(error => done(error));
        }
    ));
    
    // tell passport how to serialize the user
    passport.serializeUser((user, done) => {
        done(null, user.dataValues.id);
    });
    
    passport.deserializeUser((id, done) => {
        models.User.findByPk(id).then(user => {
            done(null, user);
          })
    });

}