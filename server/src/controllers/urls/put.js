import models from '../../models';
import validUrl from 'valid-url';

const UrlsPuts = {
    editUrl(req, res){
        const { originalUrl, code } = req.body;
        if (validUrl.isUri(originalUrl)) {
            try {
                if (code) {
                    models.Url.findByPk(code).then(url => {
                        if (url) {
                            if (url.get('UserId') === req.user.dataValues.id) {
                                models.Url.update(
                                    { originalUrl: originalUrl } /* set attributes' value */,
                                    { where: { code } }
                                ).then(function() {
                                    return res.send({
                                        message: 'you have successfully registered a new url.',
                                        code,
                                        originalUrl,
                                    });
                                });
                            } else {
                                return res.status(403).json('Forbidden access');
                            }
                        } else {
                            return res.status(404).json('No url found');
                        }
                    });
                } else {
                    return res.status(400).send({
                        message: 'No code was provided.',
                    });
                }
            } catch (error) {
                console.log(error);
                res.status(500).send({ message: 'Server error.', error: error });
            }
        } else {
            res.status(400).send({
                message: 'Invalid long url. Make sure it starts with http:// or https://',
            });
        }
    }
}

export default UrlsPuts;