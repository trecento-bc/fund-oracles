//example: {  token: 'TRCOF' , valueInEther: 1 };

function Rate (token, valueInEther) {       
  this.token = token || null;
  this.valueInEther  = valueInEther  || null;
}

Rate.prototype.getToken = function() {
  return this.token;
}

Rate.prototype.setToken = function(token) {
  this.token = token;
}

Rate.prototype.getValueInEther = function() {
  return this.valueInEther;
}

Rate.prototype.setValueInEther = function(valueInEther) {
  this.valueInEther = valueInEther;
}

Rate.prototype.equals = function(otherRate) {
  return otherRate.getValueInEther() == this.getValueInEther()
      && otherRate.getToken() == this.getToken();
}

Rate.prototype.fill = function(newFields) {
  for (var field in newFields) {
      if (this.hasOwnProperty(field) && newFields.hasOwnProperty(field)) {
          if (this[field] !== 'undefined') {
              this[field] = newFields[field];
          }
      }
  }
};

module.exports = Rate; 