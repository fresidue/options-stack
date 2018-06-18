'use strict';

const _ = require('lodash');
const assert = require('assert');

const createStack = require('./options-stack');

describe('testing stack', () => {
  it('simple case', () => {
    const stack = createStack({
      a: 'a', b: 'b', c: 'c'
    });
    stack.addOptions({
      b: 'bb', c: undefined, d: 'd'
    });
    const opts = stack.options();
    assert(_.isEqual(opts, {
      a: 'a', b: 'bb', c: undefined, d:'d'
    }));
  });

  it('with filter', () => {
    const stack = createStack({
      a: 'a', b: 'b', c: 'c'
    });
    stack.addOptions({
      a: 'dog'
    }, 'dog');
    stack.addOptions({
      b: 'cat',
      c: 'cat'
    }, 'cat');
    stack.addOptions({
      c: 'mouse'
    }, 'cat');
    const opts = stack.options();
    const dogOpts = stack.options('dog');
    assert(_.isEqual(dogOpts, {
      a: 'dog', b: 'b', c: 'c'
    }));
    const catOpts = stack.options('cat');
    assert(_.isEqual(catOpts, {
      a: 'a', b: 'cat', c: 'mouse'
    }));
    const mouseOpts = stack.options('mouse');
    assert(_.isEqual(mouseOpts, {
      a: 'a', b: 'b', c: 'c'
    }));
  });

  after(() => {
    console.log('\ntests ended:', new Date(), '\n');
  });
});
