//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const subscriptionService = require('../server/SubscriptionService');
const should = chai.should();
const assert = require('chai').assert;
const server = require('../server/Server');

chai.use(chaiHttp);

describe('Subscribe new Investor ', () => {

    it('it should not add a subscription without token', (done) => {
        let subscription = { "investorId": 1, "quantity":8 }
        chai.request(server)
            .post('/api/subscriptions')
            .send(subscription)
            .end((err, res) => {
                res.should.have.status(400);
            done();
            });
      });

      it('it should not add a subscription with unkonwn token', (done) => {
        let subscription = { "investorId": 1, "token": "XXXX", "quantity":8 }
        chai.request(server)
            .post('/api/subscriptions')
            .send(subscription)
            .end((err, res) => {
                res.should.have.status(400);
               done();
            });
      });

    it('it should validate Subscription', (done) => {
         done();
    });

    it('it should get NAV Values', (done) => {
         done();
    });
    
    it('it should calculate Token Amount', (done) => {
         done();
    });

    it('it should call Smart Contract to mint OpenFundToken', (done) => {
         done();
    });  


   


});

  