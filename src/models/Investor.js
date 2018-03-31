//example  {id: 1, firstName: 'Jane', lastName:'Doe'};

function Investor (id, firstName, lastName) {       
  this.id = id || null;
  this.firstName  = firstName  || null;
  this.lastName  = lastName  || null;
}

Investor.prototype.getId = function() {
  return this.id;
}

Investor.prototype.setId = function(id) {
  this.id = id;
}

Investor.prototype.getFirstName = function() {
  return this.firstName;
}

Investor.prototype.setFirstName = function(firstName) {
  this.firstName = firstName;
}

Investor.prototype.getLastName = function() {
  return this.lastName;
}

Investor.prototype.setLastName = function(lastName) {
  this.lastName = lastName;
}


Investor.prototype.equals = function(otherInvestor) {
  return otherInvestor.getFirstName() == this.getFirstName()
  && otherInvestor.getLastName() == this.getLastName()
      && otherInvestor.getId() == this.getId();
}

Investor.prototype.fill = function(newFields) {
  for (var field in newFields) {
      if (this.hasOwnProperty(field) && newFields.hasOwnProperty(field)) {
          if (this[field] !== 'undefined') {
              this[field] = newFields[field];
          }
      }
  }
};

module.exports = Investor;     