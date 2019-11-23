module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }else{
            return res.status(401).send({
                message: "Unauthorized request. Please login."
            });
        }
    }
}