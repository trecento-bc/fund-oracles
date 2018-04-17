var Model = require('../../src/models/Subscription');



function SubscriptionRepository() {
    this.subscriptions = [
        new Model(1, 1, "TRCOF", 2, "2018-03-28T15:09:16Z", '0x0f21f6fb13310ac0e17205840a91da93119efbec','fdb2886b1ff5a0e60f9a4684e385aa7b77f064730304143f08ba96ca1a17effa')
    ];
}

SubscriptionRepository.prototype.findAll = function () {
    return this.subscriptions;
    // load subscriptions ( simulate async using promise)
    //return Promise.resolve(this.subscriptions);
};
SubscriptionRepository.prototype.findOne = function (id) {
    // load subscription 
    var foundSubscription = undefined;
    this.subscriptions.forEach(function (subscription) {
        if (subscription.id === id)
            foundSubscription = subscription;
    });
    return foundSubscription;
};
SubscriptionRepository.prototype.save = function (subscription) {
    //  save a subscription 
    this.subscriptions.push(subscription);
    return subscription;
};
SubscriptionRepository.prototype.remove = function (id) {
    // remove a subscription  
    var subscription = this.findOne(id);
    if (subscription)
        this.subscriptions.splice(this.subscriptions.indexOf(subscription), 1);
    return subscription;
};


module.exports = SubscriptionRepository;
