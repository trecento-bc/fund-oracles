// { id:1, investorId: 1, token: 'TRCOF', quantity:2, subScriptionDate:'2018-03-28T15:09:16Z' }
import {Subscription} from "../models/Subscription";

export class SubscriptionRepository {

    private subscriptions = [
        new Subscription(1 , 1, "TRCOF", 2, "2018-03-28T15:09:16Z")
    ];

    findAll() {
        // load subscriptions ( simulate async using promise)
        return Promise.resolve(this.subscriptions);
    }

    findOne(id: number) {
        // load subscription 
        let foundSubscription: Subscription = undefined;
        this.subscriptions.forEach(subscription => {
            if (subscription.id === id)
            foundSubscription = subscription;
        });
        return foundSubscription;
    }

    save(subscription: Subscription) {
        //  save a subscription 
        this.subscriptions.push(subscription);
        return subscription;
    }

    remove(id: number) {
        // remove a subscription  
        const subscription = this.findOne(id);
        if (subscription)
            this.subscriptions.splice(this.subscriptions.indexOf(subscription), 1);

        return subscription;
    }

}