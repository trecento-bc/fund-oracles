//example:   { id:1, investorId: 1, token: 'TRCOF', quantity:2, subScriptionDate:'2018-03-28T15:09:16Z' };

export class Subscription {

  id: number;
  investorId:number;
  token: string;
  quantity: number;
  subScriptionDate:string;

  constructor(id: number, investorId: number,token: string,  quantity: number, subScriptionDate:string) {
      this.id = id;
      this.investorId = investorId;
      this.token = token;
      this.quantity = quantity;
      this.subScriptionDate = subScriptionDate;
  }

}