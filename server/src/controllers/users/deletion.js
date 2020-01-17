import models from '../../models';

const UsersDeletions = {
    accountDelete(req, res){
        try {
            const userId = req.user.id;
            req.logout();
    
            models.User.findByPk(userId).then((user)=>{
                user.destroy();
                res.send({
                    message:'you have successfully deleted your account.'
                });
            })
    
        } catch (err) {
            console.error(err);
            res.status(500).json('Server error');
        }
    }
}

export default UsersDeletions;