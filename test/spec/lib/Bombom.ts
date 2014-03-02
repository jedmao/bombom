import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;

import Bombom = require('../../../lib/Bombom');


// ReSharper disable WrongExpressionStatement
describe('Bombom', () => {

	var bombom: Bombom;
	before(() => {
		bombom = new Bombom();
	});

	it('does foo', () => {
		expect(bombom.foo).to.eq('bar');
	});

});
