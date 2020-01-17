import models from '../../models';

const UsersPuts = {
    editAccount(req, res){
        const { name, email, password, password2 } = req.body;
        let errors = [];
    
        if (password) {
            //check passwords match
            if (password !== password2) {
                errors.push('Passwords do not match.');
            }
            //check pass length
            if (password.length < 6) {
                errors.push('Password should be at least 6 characters.');
            }
        }
    
        if (errors.length > 0) {
            return res.status(400).send({
                message: errors,
            });
        } else {
            models.User.findOne({ where: { email } }).then(user => {
                if (user) {
                    errors.push('Email is already registered');
                    return res.status(400).send({
                        message: errors,
                    });
                } else {
                    if (password) {
                        bcrypt.genSalt(10, (err, salt) =>
                            bcrypt.hash(password, salt, (err, hash) => {
                                if (err) throw err;
                                //save user
                                req.user.password = hash;
                                if (email) {
                                    req.user.email = email;
                                }
    
                                if (name) {
                                    req.user.name = name;
                                }
                                req.user.save().then(() => {
                                    return res.send({
                                        message: 'you have successfully changed your account info.',
                                        email: req.user.email,
                                        name: req.user.name,
                                    });
                                });
                            })
                        );
                    } else {
                        if (email) {
                            req.user.email = email;
                        }
    
                        if (name) {
                            req.user.name = name;
                        }
    
                        req.user.save().then(() => {
                            return res.send({
                                message: 'you have successfully changed your account info.',
                                email: req.user.email,
                                name: req.user.name,
                            });
                        });
                    }
                }
            });
        }
    }
}

export default UsersPuts;