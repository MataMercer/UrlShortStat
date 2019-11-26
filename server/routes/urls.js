const express = require('express');
const router = express.Router();
var models  = require('../models');
const {ensureAuthenticated} = require('./../auth/auth');
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');

router.post('/create', ensureAuthenticated, async (req, res)=>{
    const {originalUrl} = req.body;
    // const baseUrl= req.get('host');
    
    if(validUrl.isUri(originalUrl)){
            console.log(req.user.dataValues.id);
            try{
                models.Url.findOne({ where: {originalUrl, UserId: req.user.dataValues.id} }).then(url => {
                    if(url){
                        return res.status(400).send({
                        message: 'Invalid url. That url is already registered for this user.'
                        });
                    }
                    else{
        
                        models.Url.create({
                            originalUrl,
                            urlCode: shortid.generate(),
                            UserId: req.user.dataValues.id
                        }).then(function() {
                            return res.send({message: 'you have successfully registered a new url.'});;
                        });
                        
                    }
                })
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

router.get('/:code', async (req, res) => {
    try {
      models.Url.findOne({ where:{urlCode: req.params.code} })
        .then((url)=>{
            if (url) {
                return res.redirect(url.dataValues.originalUrl);
              } else {
                return res.status(404).json('No url found');
              }
        })    
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
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

module.exports = router;