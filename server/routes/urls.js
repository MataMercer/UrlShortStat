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


router.post('/create', ensureAuthenticated, (req, res)=>{
    const {originalUrl, customUrl} = req.body;
    // const baseUrl= req.get('host');
    
    if(validUrl.isUri(originalUrl)){
            try{
                if(customUrl){
                    models.Url.findOne({ where: {code: customUrl}}).then(url => {
                        if(url){
                            return res.status(400).send({
                                message: 'That custom URL code is already taken. Please try again.'
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
        res.status(400).send({message: 'Invalid long url. Make sure it starts with http:// or https://'});
    }

});

router.put('/edit', ensureAuthenticated, (req, res)=>{
    const {originalUrl, code} = req.body;
    // const baseUrl= req.get('host');
    
    if(validUrl.isUri(originalUrl)){
            try{
                if(code){
                    models.Url.findByPk(code).then(url => {
                        if(url){
                            if(url.get('UserId') === req.user.dataValues.id){
                                models.Url.update(
                                    { originalUrl: originalUrl }, /* set attributes' value */
                                    { where: { code }})
                                    .then(function() {
                                        return res.send({message: 'you have successfully registered a new url.', code, originalUrl});                               
                                    });
                            }
                            else{
                                return res.status(403).json('Forbidden access');
                            }
                        }
                        else{
                            return res.status(404).json('No url found');
                        }
                    })
                }
                else{
                    return res.status(400).send({
                        message: 'No code was provided.'
                    });
                }
            }
            catch(error){
                console.log(error)
                res.status(500).send({message:'Server error.'});
            }
    }
    else{
        res.status(400).send({message: 'Invalid long url. Make sure it starts with http:// or https://'});
    }

});

router.get('/', ensureAuthenticated, (req,res)=>{
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

router.delete('/:code', ensureAuthenticated, (req, res) => {
    try {
        models.Url.findByPk(req.params.code)
          .then((url)=>{
              if (url) {
                  if(url.get('UserId') === req.user.dataValues.id){
                    url.destroy();
                    return res.json('url deleted');
                  }
                  else{
                    return res.status(403).json('Forbidden access');
                  }
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

router.get('/analytics', ensureAuthenticated, (req, res) => {
    try {
        const { timeSpan, unitsBackInTime, code, date } = req.body;
        
        const currentDate = new Date(date);
        let lowerBoundDate;
        let upperBoundDate;
        let format;
        switch(timeSpan){
            case 'month':
               lowerBoundDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - unitsBackInTime, 1); // first dday of month
               upperBoundDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - unitsBackInTime + 1, 0);//first of next month
               format = "MM/DD/YYYY";
               break;
            case 'year':
                lowerBoundDate = new Date(currentDate.getFullYear() - unitsBackInTime, 0, 1);
                upperBoundDate = new Date(currentDate.getFullYear() + 1 - unitsBackInTime, 0, 0);
                format = "MM/YYYY";
                break; 
            case 'eachyear':
                upperBoundDate = currentDate;
                lowerBoundDate = new Date(currentDate.getFullYear() + 1 - unitsBackInTime, 0, 1); //earliest is 20 years ago
                format = "YYYY";
                break;
            default:
                //last 30 days
                upperBoundDate = currentDate;
                lowerBoundDate = new Date(upperBoundDate.getFullYear(), upperBoundDate.getMonth()-1, upperBoundDate.getDate());
                format = "MM/DD/YYYY";
        }

        models.Visit
            .findAndCountAll({where:
                {
                    UrlCode: code,
                    createdAt: {
                        [Op.lte]: upperBoundDate,
                        [Op.gte]: lowerBoundDate
                      }
                
                }})
            .then((visits)=>{
              const cleanedVisits = visits.rows.map((visit)=>(moment(visit.get('createdAt')).format(format)));
              let dateToVisitCount = {};
              for(let i = 0; i<cleanedVisits.length; i++){
                    if((cleanedVisits[i] in dateToVisitCount) === false){
                        dateToVisitCount[cleanedVisits[i]] = 1;
                    }else{
                        dateToVisitCount[cleanedVisits[i]] = dateToVisitCount[cleanedVisits[i]] + 1;
                    }
                }
            return res.send({dataPoints: dateToVisitCount,
                            totalVisits: visits.count})
          })    
      } catch (err) {
        console.error(err);
        return res.status(500).json('Server error');
      }
})



module.exports = router;