//example:   { id:1, investorId: 1, token: 'TRCOF', depositedAmount:2, subScriptionDate:'2018-03-28T15:09:16Z', address:'0x0f21f6fb13310ac0e17205840a91da93119efbec' };

function Subscription (id, investorId, token, depositedAmount, subScriptionDate, address) {       
  this.id = id || null;
  this.investorId  = investorId  || null;
  this.token  = token  || null;
  this.depositedAmount  = depositedAmount  || null;
  this.subScriptionDate  = subScriptionDate  || null;
  this.address = address;
}

Subscription.prototype.getId = function() {
  return this.id;
}

Subscription.prototype.setId = function(id) {
  this.id = id;
}

Subscription.prototype.getInvestorId = function() {
  return this.investorId;
}

Subscription.prototype.setInvestorId = function(investorId) {
  this.investorId = investorId;
}

Subscription.prototype.getToken = function() {
  return this.token;
}

Subscription.prototype.setToken = function(token) {
  this.token = token;
}

Subscription.prototype.getSubScriptionDate = function() {
  return this.subScriptionDate;
}

Subscription.prototype.setSubScriptionDate = function(subScriptionDate) {
  this.subScriptionDate = subScriptionDate;
}


Subscription.prototype.getAddress = function() {
  return this.address;
}

Subscription.prototype.setAddress = function(address) {
  this.address = address;
}


Subscription.prototype.equals = function(otherSubscription) {

  if ((this.address && this.address !== 'undefined') || 
      (otherSubscription.address && otherSubscription.address !== 'undefined' )){
    return this.address == otherSubscription.address;
  }  else{
    return otherSubscription.getFirstName() == this.getFirstName()
    && otherSubscription.getLastName() == this.getLastName()
        && otherSubscription.getId() == this.getId();
  } 

}

Subscription.prototype.fill = function(newFields) {
  for (var field in newFields) {
      if (this.hasOwnProperty(field) && newFields.hasOwnProperty(field)) {
          if (this[field] !== 'undefined') {
              this[field] = newFields[field];
          }
      }
  }
};

module.exports = Subscription; 