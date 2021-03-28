const { expect } = require('chai');
const sinon = require('sinon');

const Instance = require('../lib/instance');

describe('Instance', () => {
    let subject;

    beforeEach(() => {
        subject = new Instance();
    });

    describe('async API', () => {
    });

    describe('sync API', () => {
        describe('#binPathSync', () => {
            it('returns immediately if _binPath is already set', () => {
                subject._binPath = '/my/path/aseprite';
                expect(subject.binPathSync()).to.equal('/my/path/aseprite');
            });

            it('sets _binPath if it was not set before', () => {
                subject._searchPaths = ['/my/path/aseprite'];
                sinon.stub(subject, 'rawSync').returns();
                expect(subject.binPathSync()).to.equal('/my/path/aseprite');
                expect(subject._binPath).to.equal('/my/path/aseprite');
            });
        });
    });
});
