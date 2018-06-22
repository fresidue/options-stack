'use strict';

const assert = require('assert');

const rootKey = Symbol('root');
const _ = require('lodash');

//
//  adding object to a stack is overloaded with 2 signatures
//

const addOptions = function (stack, ...args) {
  // Signature 1: (key, options)
  const addSingle = (key, options) => {
    assert(
      typeof key === 'string' || typeof key === 'symbol',
      'options key must be a string or a symbol'
    );
    assert(
      !options || typeof options === 'object',
      'invalid options (must be falsey or an object)'
    );
    stack.push({[key]: options || {}});
  };
  // Signature 2: {key0: options0, key1: options1, ... }
  const addMultiple = multi => {
    Object.keys(multi).forEach(key => addSingle(key, multi[key]));
  };
  // doing the business
  if (args.length === 2) {
    return addSingle(...args);
  }
  if (args.length === 1) {
    assert(
      typeof args[0] === 'object',
      'invalid add MULTI options object'
    );
    return addMultiple(...args);
  }
  throw new Error('Invalid number of addOptions args');
};

//
// Getting options for a given key
//

const getOptions = (stack, key) => {
  const filtered = _.reduce(stack, (acc, layer) => {
    const layerKey = _.get(_.keys(layer), '0', rootKey);
    if (key === layerKey || layerKey === rootKey) {
      return _.assign(acc, layer[layerKey]);
    }
    return acc;
  }, {});
  return filtered;
};

//
// Creating a new options stack (i.e. the module.exports)
//

const createStack = rootOptions => {
  // the stateful options storage
  const stack = [];
  // adding options - two signatures allowed
  const add = function (...args) {
    return addOptions(stack, ...args)
  };
  // add root options (null is ok)
  addOptions(stack, rootKey, rootOptions);
  // get options - matches or is a root option
  const get = (key, transientOpts) => {
    return Object.assign(getOptions(stack, key || rootKey), transientOpts);
  };

  return {
    stack,
    get,
    add,
    addRoot: opts => add(rootKey, opts)
  };
};

module.exports = createStack;
