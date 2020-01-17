import app from '../../src/app'

describe('Edit route', () =>{
    const chai = require('chai');
    const expect = chai.expect;
    const chaiHttp = require('chai-http');
    chai.use(chaiHttp);
    
    const models = require('../../src/models');

    const validUser = {
        'name': 'validname',
        'email': 'valid@email.com',
        'password': 'validpassword',
        'password2': 'validpassword'
    }

    const validUser2 = {
        'name': 'validname2',
        'email': 'valid2@email.com',
        'password': 'validpassword',
        'password2': 'validpassword'
    }

    
    const testUrlCode = 1;
    const agent = chai.request.agent(app);
    //helper functions to be called in before()
    const registerUser = (user) => {
        return agent
            .post('/api/user/register')
            .type('application/json')
            .send(user);
    };

    const loginUser = (user) => {
        return agent
            .post('/api/user/login')
            .type('application/json')
            .send(user);
    };

    const logoutUser = () => {
        return agent
            .post('/api/user/logout')
            .type('application/json');
    };


    const createUrl = (code, originalUrl) => {

        const validUrl = {
            customUrl: code,
            originalUrl: originalUrl  
        }
         
        return agent
            .post('/api/url/create')
            .type('application/json')
            .send(validUrl);

    }

    before(async function() {
        await require('../../src/models').sequelize.sync({force: true});
        await registerUser(validUser);
        await logoutUser();
        await registerUser(validUser2);
        await logoutUser();

    
    });
    
    beforeEach(async function() {
        
        await models.Url.destroy({truncate: true});
        await logoutUser();
    });

    after(async function(){
        agent.close();
    })


    it('edits a url from going to google.com to yahoo.com', async () => {
        const urlCode = 1;
        
        const url = {
            code: '1',
            originalUrl: 'https://www.google.com/'
        }

        const editedUrl = {
            code: '1',
            originalUrl: 'https://www.yahoo.com/'
        }

        await loginUser(validUser)
        await createUrl(url.code, url.originalUrl)

        const response = await agent
        .put('/api/url/edit')
        .type('application/json')
        .send(editedUrl);

        
        expect(response).to.have.status(200);
        expect(response.body.originalUrl).to.be.equal(editedUrl.originalUrl);
        expect(response.body.code).to.be.equal(editedUrl.code);
    });

    it('returns a 403 status code when the url does not belong to the user', async () => {

        const url = {
            code: '1',
            originalUrl: 'https://www.google.com/'
        }

        const editedUrl = {
            code: '1',
            originalUrl: 'https://www.yahoo.com/'
        }
        await loginUser(validUser);
        await createUrl(url.code, url.originalUrl);
        await logoutUser();
        await loginUser(validUser2);
        const response = await agent
            .put('/api/url/edit')
            .type('application/json')
            .send(editedUrl);
        expect(response).to.have.status(403);
    });

    it('returns a 404 if nonexisting url code is provided.', async () => {
        const urlCode = 1;
        
        const url = {
            code: '1',
            originalUrl: 'https://www.google.com/'
        }

        const editedUrl = {
            code: '-1',
            originalUrl: 'https://www.yahoo.com/'
        }

        await loginUser(validUser)
        await createUrl(url.code, url.originalUrl)

        const response = await agent
        .put('/api/url/edit')
        .type('application/json')
        .send(editedUrl);

        
        expect(response).to.have.status(404);
    });



});



describe('Delete route', () =>{
    const chai = require('chai');
    const expect = chai.expect;
    const chaiHttp = require('chai-http');
    chai.use(chaiHttp);
    const models = require('../../src/models');

    const validUser = {
        'name': 'validname',
        'email': 'valid@email.com',
        'password': 'validpassword',
        'password2': 'validpassword'
    }

    const validUser2 = {
        'name': 'validname2',
        'email': 'valid2@email.com',
        'password': 'validpassword',
        'password2': 'validpassword'
    }

    
    const testUrlCode = 1;
    const agent = chai.request.agent(app);
    //helper functions to be called in before()
    const registerUser = (user) => {
        return agent
            .post('/api/user/register')
            .type('application/json')
            .send(user);
    };

    const loginUser = (user) => {
        return agent
            .post('/api/user/login')
            .type('application/json')
            .send(user);
    };

    const logoutUser = () => {
        return agent
            .post('/api/user/logout')
            .type('application/json');
    };


    const createUrl = (urlCode) => {

        const validUrl = {
            customUrl: urlCode,
            originalUrl: 'https://www.google.com/'  
        }
         
        return agent
            .post('/api/url/create')
            .type('application/json')
            .send(validUrl);

    }

    before(async function() {
        await require('../../src/models').sequelize.sync({force: true});
        await registerUser(validUser);
        await logoutUser();
        await registerUser(validUser2);
        await logoutUser();

    
    });
    
    beforeEach(async function() {
        
        
        await logoutUser();
    });

    after(async function(){
        agent.close();
    })


    it('deletes an url', async () => {
        const urlCode = 1;
    
        await loginUser(validUser)
        await createUrl(urlCode)

        const response = await agent
        .delete('/api/url/' + urlCode)
        .type('application/json');

        expect(response).to.have.status(200);
    });

    it('returns a 403 status code when the url does not belong to the user', async () => {
        const urlCodeForValidUser1 = 1;
        
        await loginUser(validUser);
        await createUrl(urlCodeForValidUser1);
        await logoutUser();
        await loginUser(validUser2);
        const response = await agent
            .delete('/api/url/' + urlCodeForValidUser1)
            .type('application/json')
        expect(response).to.have.status(403);
    });



});


describe('Analytics route', () => {
    const chai = require('chai');
    const expect = chai.expect;
    const chaiHttp = require('chai-http');
    chai.use(chaiHttp);
    const models = require('../../src/models');

    const validUser = {
        'name': 'valid3name',
        'email': 'valid3@email.com',
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
            .send(validUser)
            .then((error, response) => {
          
            });
    };
    const createUrl = () => {
     
        const visitUrlCode = 1;
        const validUrl = {
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
        let testVisits =[];
        
        for(let i = 0; i < 12; i++){
            testVisits.push(
                {
                    UrlCode: visitUrlCode,
                    createdAt:new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1)
                }
            );
        }
        

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
        await require('../../src/models').sequelize.sync({force: true});

        await registerUser();
        await createUrl();
        await createDates();

        

    });

    after(async function(){
        agent.close();
    })
    

    //test visits that happened in last 31 days regardless of month
    it('Returns a 200 response and a map of visit counts by day that occurred in the last 30 days of the baseDate.', (done) => {
        // models.Visit.findAndCountAll()
        // .then((result)=>{
        //     // console.log(result.rows.map((visit)=>visit.get("createdAt").toString()));
        //     console.log(result.count);
        // }) 
        const body = {
            timeSpan: "", 
            unitsBackInTime: "", 
            code: visitUrlCode,
            date: baseDate
        }

        agent
            .post('/api/url/analytics')
            .type('application/json')
            .send(body)
            .end((error, response) => {
                if (error) done(error);
                expect(response).to.have.status(200);
                expect(Object.keys(response.body.dataPoints).length).to.be.equal(30);
                // const totalVisits = Object.values(response.body.dataPoints).reduce((a, b) => a+b);
                // expect(response.body.totalVisits).to.be.equal(totalVisits);
                done();
            });

    });

    //tests occurrences within current month only.
    it('Returns a 200 response and a map of visit counts by day that occurred in the month of baseDate.', (done) => {
        const body = {
            timeSpan: "month", 
            unitsBackInTime: 0, 
            code: visitUrlCode,
            date: baseDate
        }

        agent
            .post('/api/url/analytics')
            .type('application/json')
            .send(body)
            .end((error, response) => {
                if (error) done(error);
                expect(response).to.have.status(200);
                //the base date is 15 days into december, so it should return at 15 days in the month.
                expect(Object.keys(response.body.dataPoints).length).to.be.equal(baseDate.getDate());
                // const totalVisits = Object.values(response.body.dataPoints).reduce((a, b) => a+b);
                // expect(response.body.totalVisits).to.be.equal(totalVisits);
                done();
            });
    });

    //test months backwards
    it('Returns a 200 response and a map of visit counts by day that occurred 2 months prior to baseDate.', (done) => {
        const body = {
            timeSpan: "month", 
            unitsBackInTime: 2, 
            code: visitUrlCode,
            date: baseDate
        }

        agent
            .post('/api/url/analytics')
            .type('application/json')
            .send(body)
            .end((error, response) => {
                if (error) done(error);
                expect(response).to.have.status(200);
                //there is at least 1 visit in each month, should return 1 for october since we only inserted oonce for that month.
                expect(Object.keys(response.body.dataPoints).length).to.be.equal(1);
                // const totalVisits = Object.values(response.body.dataPoints).reduce((a, b) => a+b);
                // expect(response.body.totalVisits).to.be.equal(totalVisits);
                done();
            });
    });


    //test year
    it('Returns a 200 response and a map of visit counts by month that occurred 2 years prior to baseDate.', (done) => {
        const body = {
            timeSpan: "year", 
            unitsBackInTime: 2, 
            code: visitUrlCode,
            date: baseDate
        }

        agent
            .post('/api/url/analytics')
            .type('application/json')
            .send(body)
            .end((error, response) => {
                if (error) done(error);
                expect(response).to.have.status(200);
                //there is at least 1 visit in each month, should return 1 for october since we only inserted oonce for that month.
                expect(Object.keys(response.body.dataPoints).length).to.be.equal(1);
                done();
            });
    });

});