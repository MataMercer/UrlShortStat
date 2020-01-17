import models from '../../models';

const UrlsDeletions = {
    urlDelete(req, res){
        try {
            models.Url.findByPk(req.params.code).then(url => {
                if (url) {
                    if (url.get('UserId') === req.user.dataValues.id) {
                        url.destroy();
                        return res.json('url deleted');
                    } else {
                        return res.status(403).json('Forbidden access');
                    }
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

export default UrlsDeletions;