//example:   { token: 'TRCOF', name: 'openfund'}

export class Fund {

  token: string;
  name: string;

  constructor(token: string, name: string) {
      this.token = token;
      this.name = name;
  }

}

/*function Fund (token, name) {       
  this.token = token || null;
  this.name  = name  || null;
}

Fund.prototype.getToken = function() {
  return this.token;
}

Fund.prototype.setToken = function(token) {
  this.token = token;
}

Fund.prototype.getName = function() {
  return this.name;
}

Fund.prototype.setName = function(name) {
  this.name = name;
}

Fund.prototype.equals = function(otherFund) {
  return otherFund.getName() == this.getName()
      && otherFund.getToken() == this.getToken();
}

Fund.prototype.fill = function(newFields) {
  for (var field in newFields) {
      if (this.hasOwnProperty(field) && newFields.hasOwnProperty(field)) {
          if (this[field] !== 'undefined') {
              this[field] = newFields[field];
          }
      }
  }
};

module.exports = Fund;     // Export Fund
*/