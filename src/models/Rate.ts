//example: {  token: 'TRCOF' , valueInEther: 1 };


export class Rate {

  token: string;
  valueInEther: number;

  constructor(token: string, valueInEther: number) {
      this.token = token;
      this.valueInEther = valueInEther;
  }

}