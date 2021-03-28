const { expect } = require('chai');
const sinon = require('sinon');

const Instance = require('../lib/instance');

describe('Instance', () => {
    let subject;

    beforeEach(() => {
        subject = new Instance();
    });

    describe('constructor', () => {
        it('accepts a string search path', () => {
            subject = new Instance();
            let list1 = subject._searchPaths;
            subject = new Instance('/horse');
            let list2 = subject._searchPaths;
            expect(list2).to.deep.equal(['/horse', ...list1]);
        });

        it('accepts an array of search paths', () => {
            subject = new Instance();
            let list1 = subject._searchPaths;
            subject = new Instance(['/horse', '/zebra']);
            let list2 = subject._searchPaths;
            expect(list2).to.deep.equal(['/horse', '/zebra', ...list1]);
        });
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

            it('checks all paths in the list', () => {
                subject._searchPaths = [
                    '/path/a',
                    '/path/b',
                    '/path/c'
                ];
                sinon.stub(subject, 'rawSync').throws(new Error('ENOENT'));
                expect(() => subject.binPathSync()).throws(/Unable to find Aseprite binary. Searched/);
            });
        });
    });
});
