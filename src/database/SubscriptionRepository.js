const fs = require('fs');
var Model = require('../../src/models/Subscription');

var subscriptions =[];

function SubscriptionRepository() {
    subscriptions = [
        
    ];
}

SubscriptionRepository.prototype.findAll =  function () {

    this.readFile(function(error, content) {
        if (error) {
          console.log(error);
         
        }
        else {
            console.log('>>>findAll: ',  JSON.parse(content));
            subscriptions =  JSON.parse(content);
        }
    });
   
    return Promise.resolve(subscriptions);
};
SubscriptionRepository.prototype.findOne = function (id) {
    // load subscription 
    var foundSubscription = undefined;
    subscriptions.forEach(function (subscription) {
        if (subscription.id === id)
            foundSubscription = subscription;
    });
    return foundSubscription;
};
SubscriptionRepository.prototype.save = function (subscription) {
    //  save a subscription 
    subscriptions.push(subscription);
    this.writeFile( function(error, content) {
        if (error) {
          console.log(error);
        }
        else {

        }
    });

    return Promise.resolve(subscription);
};
SubscriptionRepository.prototype.remove = function (id) {
    // remove a subscription  
    var subscription = this.findOne(id);
    if (subscription)
        subscriptions.splice(subscriptions.indexOf(subscription), 1);
    return subscription;
};


SubscriptionRepository.prototype.writeFile = function (callback) {
    fs.writeFile( "subscription.json", JSON.stringify(subscriptions), "utf8", callback);
};

SubscriptionRepository.prototype.readFile = function (callback) {
    fs.readFile('subscription.json', callback);
};



module.exports = SubscriptionRepository;
