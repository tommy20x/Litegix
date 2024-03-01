const uuid = require('uuid');

const value = uuid.v4().replace(/-/g, "");
console.log(value);