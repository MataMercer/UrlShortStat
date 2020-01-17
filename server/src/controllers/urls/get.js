import models from '../../models';
const UrlsGets = {
    allUrls(req, res){
        try {
            models.Url.findAndCountAll({
                where: { UserId: req.user.dataValues.id },
            }).then(result => {
                res.send({
                    count: result.count,
                    urls: result.rows,
                });
            });
        } catch (err) {
            console.error(err);
            res.status(500).json('Server error');
        }
    }

}

export default UrlsGets;