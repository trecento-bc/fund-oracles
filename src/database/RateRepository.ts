import {Rate} from "../models/Rate";

export class RateRepository {

    private rates = [
        new Rate("TRCOF", 1)
    ];

    findAll() {
        // load rates ( simulate async using promise)
        return Promise.resolve(this.rates);
    }

    findOne(token: string) {
        // load rate 
        let foundRate: Rate = undefined;
        this.rates.forEach(rate => {
            if (rate.token === token)
            foundRate = rate;
        });
        return foundRate;
    }

    save(rate: Rate) {
        //  save a rate 
        this.rates.push(rate);
        return rate;
    }

    remove(token: string) {
        // remove a rate  
        const rate = this.findOne(token);
        if (rate)
            this.rates.splice(this.rates.indexOf(rate), 1);

        return rate;
    }

}