//example  {id: 1, firstName: 'Jane', lastName:'Doe'};

export class Investor {

  id: number;
  firstName: string;
  lastName: string;

  constructor(id: number, firstName: string, lastName: string) {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
  }

}