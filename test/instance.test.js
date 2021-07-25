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

    describe('flattenArgs', () => {
        it('given a file path and args object, returns array', () => {
            expect(subject.flattenArgs(['in.aseprite', { crabs: 3 }])).to.deep.equal(
                ['--batch', 'in.aseprite', '--crabs=3']
            );
        });

        it('given a file path and args array, returns array', () => {
            expect(subject.flattenArgs(['in.aseprite', ['--crabs', 3]])).to.deep.equal(
                ['--batch', 'in.aseprite', '--crabs', 3]
            );
        });

        it('given a file path and args string, returns string', () => {
            expect(subject.flattenArgs(['in.aseprite', '--crabs 3'])).to.deep.equal(
                '--batch in.aseprite --crabs 3'
            );
        });

        it('given just an args array, returns array', () => {
            expect(subject.flattenArgs([['in.aseprite', '--crabs', 3]])).to.deep.equal(
                ['--batch', 'in.aseprite', '--crabs', 3]
            );
        });

        it('given just an args object, returns array', () => {
            expect(subject.flattenArgs([{ crabs: 3 }])).to.deep.equal(
                ['--batch', '--crabs=3']
            );
        });

        it('given just an args string, returns string', () => {
            expect(subject.flattenArgs(['in.aseprite --crabs 3'])).to.deep.equal(
                '--batch in.aseprite --crabs 3'
            );
        });
    });
});
