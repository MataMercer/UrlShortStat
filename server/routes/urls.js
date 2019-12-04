const express = require('express');
const router = express.Router();
var models  = require('../models');
const {ensureAuthenticated} = require('./../auth/auth');
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');

router.post('/create', ensureAuthenticated, async (req, res)=>{
    const {originalUrl, customUrl} = req.body;
    // const baseUrl= req.get('host');
    
    if(validUrl.isUri(originalUrl)){
            try{
                if(customUrl){
                    models.Url.findOne({ where: {urlCode: customUrl}}).then(url => {
                        if(url){
                            return res.status(400).send({
                                message: 'That URL is already taken. Please try again.'
                            });
                        }
                        else{
                            if(customUrl){
                                models.Url.create({
                                    originalUrl,
                                    urlCode: customUrl,
                                    UserId: req.user.dataValues.id,
                                }).then(function() {
                                    return res.send({message: 'you have successfully registered a new url.'});                               
                                });
                            }
                        }
                    })
                }
                else{
                    const newUrlCode = shortid.generate();
                    models.Url.findOne({where:{urlCode: newUrlCode}}).then(url =>{
                        if(!url){
                            models.Url.create({
                                originalUrl,
                                urlCode: newUrlCode,
                                UserId: req.user.dataValues.id,
                            }).then(function() {
                                return res.send({message: 'you have successfully registered a new url.'});                               
                            });
                        }else{
                            return res.status(500).send({
                                message: 'Try resubmitting. Server had trouble generating a unique ID.'
                            });
                        }
                    });
                }
            }
            catch(error){
                console.log(error)
                res.status(500).send({message:'Server error.'});
            }
    }
    else{
        res.status(400).send({message: 'Invalid long url'});
    }

});



router.get('/', ensureAuthenticated, async(req,res)=>{
    try {
        models.Url.findAndCountAll({ where:{UserId: req.user.dataValues.id} })
          .then((result)=>{
              res.send({
                  count: result.count,
                  urls: result.rows
            })
          })    
      } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
      }
})

router.delete('/:code', ensureAuthenticated, async(req, res) => {
    try {
        models.Url.findByPk(req.params.code)
          .then((url)=>{
              if (url) {
                  url.destroy();
                  return res.json('url deleted');
                } else {
                  return res.status(404).json('No url found');
                }
          })    
      } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
      }

});

module.exports = router;