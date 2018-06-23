'use strict';

const _ = require('lodash');
const assert = require('assert');

const timeSpan = require('time-span');
const fromBeginning = timeSpan();

const createStack = require('./options-stack');

describe('testing stack', () => {
  it('multiple options compose correctly', () => {
    const stack = createStack({
      a: 'a', b: 'b', c: 'c'
    });
    stack.addRoot({
      b: 'bb', c: undefined, d: 'd'
    });
    const rootOpts = stack.get();
    assert(
      _.isEqual(rootOpts, {
        a: 'a', b: 'bb', c: undefined, d:'d'
      }),
      'opts = ' + JSON.stringify(rootOpts)
    );
    stack.add('specific', {e: 'e'});
    const specificOpts = stack.get('specific');
    assert(
      _.isEqual(specificOpts, {
        a: 'a', b: 'bb', c: undefined, d:'d', e: 'e'
      }),
      'opts = ' + JSON.stringify(specificOpts)
    );
  });

  it('adding at once or multiply should not make a difference', () => {
    const stack1 = createStack();
    const stack2 = createStack();
    const a = {has: 'junk'};
    const b = {some: 'stuff'};
    stack1.add({a, b});
    assert(
      _.isEqual(stack1.get('a'), {has: 'junk'}),
      'opts = ' + JSON.stringify(stack1.get('a'))
    );
    assert(
      _.isEqual(stack1.get('b'), {some: 'stuff'}),
      'opts = ' + JSON.stringify(stack1.get('a'))
    );
    stack2.add('a', a);
    stack2.add('b', b);
    assert(
      _.isEqual(stack1.get('a'), stack2.get('a')),
      'stacks should be equal'
    );
    assert(
      _.isEqual(stack1.get('b'), stack2.get('b')),
      'stacks should be equal'
    );
    const origOptionsA = stack1.get('a');
    const aMods = {more: 'stuff'};
    stack1.add('a', aMods);
    stack2.add('a', aMods);
    const newOptionsA = stack1.get('a');
    assert(
      _.isEqual(newOptionsA, {has: 'junk', more: 'stuff'}),
      'aMods not applied correctly'
    );
    assert(
      !_.isEqual(newOptionsA, origOptionsA),
      'origOptionsA should not have mutated'
    );
  });

  it('mutating input objects should propagate', () => {
    const rootOpts = {
      some: 'thing',
      second: {nested: 'thing2'}
    };
    const stack = createStack(rootOpts);
    const origOpts = stack.get();
    assert(
      _.isEqual(origOpts, rootOpts),
      'contents should be the same'
    );
    assert(
      origOpts !== rootOpts,
      'but should not be the same object'
    );
    rootOpts.some = 'otherThing';
    assert(
      origOpts.some === 'thing',
      'the mutation should NOT have propagated in first layer'
    );
    rootOpts.second.nested = 'otherThing2';
    assert(
      origOpts.second.nested === 'otherThing2',
      'but mutations in second layer SHOULD propagate'
    );
  });

  it('last value added should be the used one', () => {
    const rootOpts = {a: 'a'};
    const rootMods = {a: 'b'};
    const specMods = {a: 'c'};
    const stack = createStack(rootOpts);
    stack.addRoot(rootMods);
    stack.add('spec', specMods);
    assert(stack.get().a === 'b');
    assert(stack.get('spec').a === 'c');
  })

  after(() => {
    console.log('\ntests ended:', new Date(), 'and took ' + fromBeginning.rounded() + ' ms\n');
  });
});
