import sinon = require('sinon');
import sinonChai = require('../../sinon-chai');
var expect = sinonChai.expect;

import Bombom = require('../../../lib/Bombom');


// ReSharper disable WrongExpressionStatement
describe('Bombom', () => {

	var bombom: Bombom;
	before(() => {
		bombom = new Bombom();
	});

	it('allows additional BOM types to be registered', () => {
		bombom.register('foo', []);
	});

	it('warns when registering a BOM would override an existing one', done => {
		bombom.once('warn', () => {
			done();
		});
		bombom.register('foo', []);
	});

	it('verifies whether a BOM type is registered', () => {
		expect(bombom.isRegistered('foo')).to.be.true;
		expect(bombom.isRegistered('bar')).to.be.false;
	});

	it('allows BOM types to be unregistered', () => {
		bombom.unregister('foo');
	});

	it('warns when trying to unregister a BOM type hasn\'t been registered', () => {
		var onUnregistered = sinon.spy();
		bombom.register('foo', []);
		bombom.once('warn', onUnregistered);
		bombom.unregister('foo');
		expect(onUnregistered).to.not.have.been.called;
		bombom.unregister('foo');
		expect(onUnregistered).to.have.been.calledOnce;
	});

	it('detects a BOM signature type', () => {
		expect(bombom.detect(new Buffer(0))).to.be.undefined;
		bombom.register('foo', [0x12, 0x34]);
		var buffer = new Buffer([0x12, 0x34, 0x56]);
		expect(bombom.detect(buffer)).to.eq('foo');
		bombom.unregister('foo');
	});

	it('verifies a buffer is signed', () => {
		expect(bombom.isSigned(new Buffer(0))).to.be.false;
		bombom.register('foo', [0x12, 0x34]);
		var buffer = new Buffer([0x12, 0x34, 0x56]);
		expect(bombom.isSigned(buffer)).to.be.true;
		bombom.unregister('foo');
	});

	it('verifies a buffer is signed by a specified type', () => {
		bombom.register('foo', [0x12, 0x34]);
		bombom.register('bar', [0x12, 0x34]);
		bombom.register('baz', [0x78, 0x90]);
		var buffer = new Buffer([0x12, 0x34, 0x56]);
		expect(bombom.isSigned(buffer, 'foo')).to.be.true;
		expect(bombom.isSigned(buffer, 'bar')).to.be.true;
		expect(bombom.isSigned(buffer, 'baz')).to.be.false;
		bombom.unregister('foo');
	});

	it('enforces a BOM signature on a buffer', () => {
		bombom.register('foo', [0x12, 0x34]);
		var buffer = new Buffer([0x56]);
		buffer = bombom.enforce(buffer, 'foo');
		expect(buffer).to.deep.equal(new Buffer([0x12, 0x34, 0x56]));
		bombom.unregister('foo');
	});

	it('strips a specified BOM type from a buffer', () => {
		bombom.register('foo', [0x12, 0x34]);
		var buffer = new Buffer([0x12, 0x34, 0x56]);
		buffer = bombom.strip(buffer, 'foo');
		expect(buffer).to.deep.equal(new Buffer([0x56]));
		bombom.unregister('foo');
	});

	it('strips any registered BOM signatures from a buffer', () => {
		bombom.register('foo', [0x12, 0x34]);
		var buffer = new Buffer([0x12, 0x34, 0x56]);
		buffer = bombom.strip(buffer);
		expect(buffer).to.deep.equal(new Buffer([0x56]));
		bombom.unregister('foo');
	});

});
