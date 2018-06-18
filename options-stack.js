'use strict';

const _ = require('lodash');
const assign = _.assign;
const reduce = _.reduce;

// const assign = Object.assign;
// const reduce = Array.reduce;

const createStack = function (rootOpts, rootFilter) {
  // the stateful options storage
  const stack = [];
  // adding options - filter can be null (will apply to ALL filters)
  const addOptions = (options, filter) => {
    stack.push({
      filter,
      options: assign({}, options)
    });
    // console.log('stack = ', stack);
  };
  addOptions(rootOpts, rootFilter);

  const getOptions = (filter, transientOpts) => {
    return reduce(stack, (acc ,layer) => {
      if (!layer.filter || filter === layer.filter) {
        return assign(acc, layer.options);
      } else {
        return acc;
      }
    }, assign({}, transientOpts));
  };

  return {
    stack,
    options: getOptions,
    addOptions,
  };
};

module.exports = createStack;
