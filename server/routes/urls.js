const express = require('express');
const router = express.Router();
var models  = require('../models');
const {ensureAuthenticated} = require('./../auth/auth');
const validUrl = require('valid-url');
const shortid = require('shortid');
const config = require('config');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');


router.post('/create', ensureAuthenticated, async (req, res)=>{
    const {originalUrl, customUrl} = req.body;
    // const baseUrl= req.get('host');
    
    if(validUrl.isUri(originalUrl)){
            try{
                if(customUrl){
                    models.Url.findOne({ where: {code: customUrl}}).then(url => {
                        if(url){
                            return res.status(400).send({
                                message: 'That URL is already taken. Please try again.'
                            });
                        }
                        else{
                            if(customUrl){
                                models.Url.create({
                                    originalUrl,
                                    code: customUrl,
                                    UserId: req.user.dataValues.id,
                                }).then(function() {
                                    return res.send({message: 'you have successfully registered a new url.', code: customUrl, originalUrl});                               
                                });
                            }
                        }
                    })
                }
                else{
                    const newCode = shortid.generate();
                    models.Url.findOne({where:{code: newCode}}).then(url =>{
                        if(!url){
                            models.Url.create({
                                originalUrl,
                                code: newCode,
                                UserId: req.user.dataValues.id,
                            }).then(function() {
                                return res.send({message: 'you have successfully registered a new url.', code: newCode, originalUrl});                               
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

function sameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }

router.get('/analytics/:code', ensureAuthenticated, async(req, res) => {
    try {
        const days = 30; //number of days to look back at. we'll just use 30 for this project. 
        models.Visit
            .findAll({where:
                {
                    UrlCode: req.params.code,
                    createdAt: {
                        [Op.lt]: new Date(),
                        [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000 * days)
                      }
                
                }})
            .then((visits)=>{
              const cleanedVisits = visits.map((visit)=>(moment(visit.get('createdAt')).format("MM/DD/YYYY")));
              let dateToVisitCount = {};
              for(let i = 0; i<cleanedVisits.length; i++){
                    if((cleanedVisits[i] in dateToVisitCount) === false){
                        dateToVisitCount[cleanedVisits[i]] = 1;
                    }else{
                        dateToVisitCount[cleanedVisits[i]] = dateToVisitCount[cleanedVisits[i]] + 1;
                    }
                }
            return res.send({monthVisits: dateToVisitCount})
          })    
      } catch (err) {
        console.error(err);
        return res.status(500).json('Server error');
      }
})



module.exports = router;