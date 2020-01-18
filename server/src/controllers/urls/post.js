import models from '../../models';
import validUrl from 'valid-url';
import shortid from 'shortid';
import {Op} from 'sequelize';
import moment from 'moment';

const UrlsPosts = {
    createUrl(req, res){
        const { originalUrl, code } = req.body;
        const customUrl = code;
        console.log(customUrl);
        console.log(originalUrl);
        if (validUrl.isUri(originalUrl)) {
            try {
                if (customUrl) {
                    models.Url.findOne({ where: { code: customUrl } }).then(url => {
                        if (url) {
                            return res.status(400).send({
                                message:
                                    'That custom URL code is already taken. Please try again.',
                            });
                        } else {
                            if (customUrl) {
                                models.Url.create({
                                    originalUrl,
                                    code: customUrl,
                                    UserId: req.user.dataValues.id,
                                }).then(function() {
                                    return res.send({
                                        message: 'you have successfully registered a new url.',
                                        code: customUrl,
                                        originalUrl,
                                    });
                                });
                            }
                        }
                    });
                } else {
                    const newCode = shortid.generate();
                    models.Url.findOne({ where: { code: newCode } }).then(url => {
                        if (!url) {
                            models.Url.create({
                                originalUrl,
                                code: newCode,
                                UserId: req.user.dataValues.id,
                            }).then(function() {
                                return res.send({
                                    message: 'you have successfully registered a new url.',
                                    code: newCode,
                                    originalUrl,
                                });
                            });
                        } else {
                            return res.status(500).send({
                                message:
                                    'Try resubmitting. Server had trouble generating a unique ID.',
                            });
                        }
                    });
                }
            } catch (error) {
                console.log(error);
                res.status(500).send({ message: 'Server error.' });
            }
        } else {
            res.status(400).send({
                message: 'Invalid long url. Make sure it starts with http:// or https://',
            });
        }
    },


    //this under post bc get doesnt allow json attachments
    analyze(req, res){
        try {
            const { timeSpan, unitsBackInTime, code, date } = req.body;
    
            const currentDate = date ? new Date(date) : new Date();
            let lowerBoundDate;
            let upperBoundDate;
            switch (timeSpan) {
                case 'month':
                    lowerBoundDate = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() - unitsBackInTime,
                        1
                    ); // first dday of month
                    upperBoundDate = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() - unitsBackInTime + 1,
                        1
                    ); //first of next month
                    break;
                case 'year':
                    lowerBoundDate = new Date(
                        currentDate.getFullYear() - unitsBackInTime,
                        0,
                        1
                    );
                    upperBoundDate = new Date(
                        currentDate.getFullYear() + 1 - unitsBackInTime,
                        0,
                        1
                    );
                    break;
                default:
                    //last 30 days
                    upperBoundDate = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate() + 1 - 30 * unitsBackInTime
                    );
                    lowerBoundDate = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate() - 30 * (unitsBackInTime + 1) 
                    );
            }
 
            models.Visit.findAndCountAll({
                where: {
                    UrlCode: code,
                    createdAt: {
                        [Op.lt]: upperBoundDate,
                        [Op.gte]: lowerBoundDate,
                    },
                },
            }).then(visits => {
                const cleanedVisits = visits.rows.map(visit =>{
                    //convert visits to a date with just year, month, and day. no hours.
                    if(timeSpan==='year'){
                        return new Date(visit.get('createdAt').getFullYear(), visit.get('createdAt').getMonth(), 1 ).toJSON();
                    }else{
                        return new Date(visit.get('createdAt').getFullYear(), visit.get('createdAt').getMonth(), visit.get('createdAt').getDate() ).toJSON();
                    } 
                }
                );
                let dateToVisitCount = {};
                for (let i = 0; i < cleanedVisits.length; i++) {
                    if (cleanedVisits[i] in dateToVisitCount === false) {
                        dateToVisitCount[cleanedVisits[i]] = 1;
                    } else {
                        dateToVisitCount[cleanedVisits[i]] =
                            dateToVisitCount[cleanedVisits[i]] + 1;
                    }
                }
    
                models.Visit.count({ where: { UrlCode: code } }).then(count => {
                    return res.send({
                        dataPoints: dateToVisitCount,
                        timeSpanVisitCount: visits.count,
                        totalVisitCount: count,
                    });
                });
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json('Server error');
        }
    }
};

export default UrlsPosts;
