import {Fund} from "../models/Fund";

export class FundRepository {

    private funds = [
        new Fund("TRCOF", "openfund")
    ];

    findAll() {
        // load funds ( simulate async using promise)
        return Promise.resolve(this.funds);
    }

    findOne(token: string) {
        // load fund 
        let foundFund: Fund = undefined;
        this.funds.forEach(fund => {
            if (fund.token === token)
            foundFund = fund;
        });
        return foundFund;
    }

    save(fund: Fund) {
        //  save a fund 
        this.funds.push(fund);
        return fund;
    }

    remove(token: string) {
        // remove a fund  
        const fund = this.findOne(token);
        if (fund)
            this.funds.splice(this.funds.indexOf(fund), 1);

        return fund;
    }

}