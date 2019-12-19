const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const Bluebird = require('bluebird');
chai.use(chaiHttp);

const app = require('../../app');
const models = require('../../models');
describe('Register route', () => {
    const validUser = {
        'name': 'validname',
        'email': 'valid@email.com',
        'password': 'validpassword',
        'password2': 'validpassword'
    }

    

    


    before(function () {
        return require('../../models').sequelize.sync();
    });
    
    beforeEach(async function () {
        await models.User.destroy({ truncate: true });
    });



    it('Returns a 200 response with valid input', (done) => {
        chai.request(app)
            .post('/api/user/register')
            .type('application/json')
            .send(validUser)
            .end((error, response) => {
                if (error) done(error);
                expect(response).to.have.status(200);
                done();
            });
    });

    it('Returns a 400 response when trying to register with an existing email.', (done)=>{
        models.User.create(validUser)
        .then(() => {
            chai.request(app)
            .post('/api/user/register')
            .type('application/json')
            .send(validUser)
            .end((error, response) => {
                if (error) done(error);
                expect(response).to.have.status(400);
                done();
            });
        })
    });

    it('Returns a 400 response when trying to register with no name.', (done)=>{
        models.User.create(validUser)
        .then(() => {
            chai.request(app)
            .post('/api/user/register')
            .type('application/json')
            .send({
                'email': 'valid@email.com',
                'password': 'validpassword',
                'password2': 'validpassword'
            })
            .end((error, response) => {
                if (error) done(error);
                expect(response).to.have.status(400);
                done();
            });
        })
    });

    
});

describe('login route', () => {
    const newUser = {
        'name': 'validname',
        'email': 'valid@email.com',
        'password': 'validpassword',
        'password2': 'validpassword'
    }

    const validUser = {
        'email': 'valid@email.com',
        'password': 'validpassword',
    }

    const invalidUser = {
        'email': 'valid@email.com',
        'password': 'invalidpassword',
    }

    
    before(function () {
        return require('../../models').sequelize.sync();
    });
    
    beforeEach(function () {
        return models.User.destroy({ truncate: true })
  
    });

    it('Returns a 200 response with correct password', (done) => {
        chai.request(app)
            .post('/api/user/register')
            .type('application/json')
            .send(newUser)
            .end((error, response) => {
                if (error) done(error);
                chai.request(app)
                    .post('/api/user/login')
                    .type('application/json')
                    .send(validUser)
                    .end((error1, response1) => {
                    if (error1) done(error1);
                        expect(response1).to.have.status(200);
                        done();
            });
            });
        
    });

    it('Returns a 400 response with for logging in with non-existing account.', (done) => {
        chai.request(app)
            .post('/api/user/login')
            .type('application/json')
            .send(validUser)
            .end((error, response) => {
                if (error) done(error);
                expect(response).to.have.status(400);
                done();
            });
    });

    it('Returns a 400 response with incorrect password', (done) => {
        chai.request(app)
            .post('/api/user/register')
            .type('application/json')
            .send(newUser)
            .end((error, response) => {
                if (error) done(error);
                chai.request(app)
                    .post('/api/user/login')
                    .type('application/json')
                    .send(invalidUser)
                    .end((error, response) => {
                        if (error) done(error);
                        expect(response).to.have.status(400);
                        done();
                         });
            });
        
    });



   

    
});

describe('logout route', () => {
    const newUser = {
        'name': 'validname',
        'email': 'valid@email.com',
        'password': 'validpassword',
        'password2': 'validpassword'
    }

    const validUser = {
        'email': 'valid@email.com',
        'password': 'validpassword',
    }

    const invalidUser = {
        'email': 'valid@email.com',
        'password': 'invalidpassword',
    }

    
    before(function () {
        return require('../../models').sequelize.sync();
    });
    
    beforeEach(function () {
        return models.User.destroy({ truncate: true })
  
    });

    it('Returns a 401 response when logging in, logging out, then going to an auth required route.', (done) => {
        let agent = chai.request.agent(app)
        agent
            .post('/api/user/register')
            .type('application/json')
            .send(newUser)
            .end((error1, response) => {
                if (error1) done(error1);
                    agent
                        .get('/authrequired')
                        .end((error1, response1) => {
                            if (error1) done(error1);
                            expect(response1).to.have.status(200);
                            done();
                        });
                });
            
            });
    

    it('Returns a 401 response when logging in, logging out, then going to an auth required route.', (done) => {
        let agent = chai.request.agent(app)
        agent
            .post('/api/user/register')
            .type('application/json')
            .send(newUser)
            .end((error1, response) => {
                if (error1) done(error1);
                agent
                    .post('/api/user/logout')
                    .type('application/json')
                    .send(validUser)
                    .end((error1, response1) => {
                        if (error1) done(error1);
                        agent
                            .get('/authrequired')
                            .end((error1, response1) => {
                                if (error1) done(error1);
                                expect(response1).to.have.status(401);
                                done();
                            });
                });
            
            });
    });
        
});



   

    
