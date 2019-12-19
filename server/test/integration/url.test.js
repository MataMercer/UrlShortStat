const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../../app');
const models = require('../../models');

describe('Analytics route', () => {
    const validUser = {
        'name': 'validname',
        'email': 'valid@email.com',
        'password': 'validpassword',
        'password2': 'validpassword'
    }

    
    let agent = chai.request.agent(app);
    const visitUrlCode = 1;
    const baseDate = new Date(2019, 11, 15);
    

    //helper functions to be called in before()
    const registerUser = () => {
        return agent
            .post('/api/user/register')
            .type('application/json')
            .send(validUser);
    };
    const createUrl = () => {
        // console.log(error);
        const visitUrlCode = 1;
        validUrl = {
            customUrl: visitUrlCode,
            originalUrl: 'https://www.google.com/'  
        }
         
        return agent
            .post('/api/url/create')
            .type('application/json')
            .send(validUrl);

    }
    const createDates = () => {
                
                //add visits varying each in year, month
                testVisits =[];
                
                // for(let i = 0; i < 1; i++){
                //     testVisits.push(
                //         {
                //             UrlCode: visitUrlCode,
                //             createdAt:new Date(baseDate.getFullYear, baseDate.getMonth() - i, 1)
                //         }
                //     );
                // }

                for(let i = 0; i < 10; i++){
                    testVisits.push(
                        {
                            UrlCode: visitUrlCode,
                            createdAt:new Date(baseDate.getFullYear() - i, baseDate.getMonth(), 1)
                        }
                    );
                }

                for(let i = 0; i < 31; i++){
                    testVisits.push(
                        {
                            UrlCode: visitUrlCode,
                            createdAt:new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - i)
                        }
                    );
                }
                let promiseList = [];
                for(let i = 0; i < testVisits.length; i++){
                    
                    promiseList.push(models.Visit.create(testVisits[i]));
                }
                return Promise.all(promiseList);
    }


    before(async function() {
        try {
            await require('../../models').sequelize.sync();
            await registerUser();
            await createUrl();
            await createDates();
        }
        catch(err){
            console.log(err);
        }
    });
            
  
    
    beforeEach(function () {
        // return Bluebird.all([
        //     models.User.destroy({ truncate: true })
        // ]);
    });



    it('Returns a 200 response and a list of visit counts that occurred in the last 31 days of the baseDate.', (done) => {
        models.Visit.findAndCountAll()
        .then((result)=>{
            // console.log(result.rows.map((visit)=>visit.get("createdAt").toString()));
            console.log(result.count);
        }) 
        const body = {
            timeSpan: "", 
            unitsBackInTime: "", 
            code: visitUrlCode,
            date: baseDate
        }

        agent
            .get('/api/url/analytics')
            .type('application/json')
            .send(body)
            .end((error, response) => {
                if (error) done(error);
                expect(response).to.have.status(200);
                expect(Object.keys(response.body.monthVisits).length).to.be.equal(31);
                done();
            });

    });

    it('Returns a 200 response and a list of visit counts that occurred in the last month of baseDate.', (done) => {

        const body = {
            timeSpan: "month", 
            unitsBackInTime: 0, 
            code: visitUrlCode,
            date: baseDate
        }

        agent
            .get('/api/url/analytics')
            .type('application/json')
            .send(body)
            .end((error, response) => {
                if (error) done(error);
                expect(response).to.have.status(200);
                expect(Object.keys(response.body.monthVisits).length).to.be.equal(baseDate.getDate());
                done();
            });

    });

});