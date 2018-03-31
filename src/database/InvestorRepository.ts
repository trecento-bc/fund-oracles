import {Investor} from "../models/Investor";

export class InvestorRepository {

    private investors = [
        new Investor(1 , "Jane", "Doe")
    ];

    findAll() {
        // load investors ( simulate async using promise)
        return Promise.resolve(this.investors);
    }

    findOne(id: number) {
        // load investor 
        let foundInvestor: Investor = undefined;
        this.investors.forEach(investor => {
            if (investor.id === id)
            foundInvestor = investor;
        });
        return foundInvestor;
    }

    save(investor: Investor) {
        //  save a investor 
        this.investors.push(investor);
        return investor;
    }

    remove(id: number) {
        // remove a investor  
        const investor = this.findOne(id);
        if (investor)
            this.investors.splice(this.investors.indexOf(investor), 1);

        return investor;
    }

}