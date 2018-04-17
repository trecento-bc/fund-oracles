//example:   { id:1, investorId: 1, token: 'TRCOF', quantity:2, subScriptionDate:'2018-03-28T15:09:16Z', address:'0x0f21f6fb13310ac0e17205840a91da93119efbec', hexPrivateKey :'fdb2886b1ff5a0e60f9a4684e385aa7b77f064730304143f08ba96ca1a17effa' };

function Subscription (id, investorId, token, quantity, subScriptionDate, address, hexPrivateKey) {       
  this.id = id || null;
  this.investorId  = investorId  || null;
  this.token  = token  || null;
  this.quantity  = quantity  || null;
  this.subScriptionDate  = subScriptionDate  || null;
  this.address = address;
  this.hexPrivateKey = hexPrivateKey;

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

Subscription.prototype.getHexPrivateKey = function() {
  return this.hexPrivateKey;
}

Subscription.prototype.setHexPrivateKey = function(hexPrivateKey) {
  this.hexPrivateKey = hexPrivateKey;
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