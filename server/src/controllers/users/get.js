import models from '../../models';

const UsersGets = {
    getUsernameAndEmail(req, res){
        try {
            res.send({
                email: req.user.dataValues.email,
                name: req.user.dataValues.name,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json('Server error');
        }
    },

    shortUrlRedirect(req, res){
        // console.log(req);
        try {
            models.Url.findByPk(req.params.code).then(url => {
                if (url) {
                    try {
                        models.Visit.create({
                            UrlCode: req.params.code,
                        });
                    } catch (err) {
                        console.log(err);
                    }
                    return res.redirect(url.dataValues.originalUrl);
                } else {
                    return res.status(404).json('No url found');
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json('Server error');
        }
    }

    

}

export default UsersGets;