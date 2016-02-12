require('ts-node').register({
	compiler: require('typescript')
});

var Bombom = require('./Bombom');
module.exports = new Bombom();
