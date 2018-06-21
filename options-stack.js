'use strict';

const createStack = function (rootOpts, rootFilter) {
  // the stateful options storage
  const stack = [];
  // adding options - filter can be null (will apply to ALL filters)
  const addOptions = (options, filter) => {
    stack.push({
      filter,
      options: Object.assign({}, options)
    });
    // console.log('stack = ', stack);
  };
  addOptions(rootOpts, rootFilter);

  const getOptions = (filter, transientOpts) => {
    return stack.reduce((acc, layer) => {
      if (!layer.filter || filter === layer.filter) {
        return Object.assign(acc, layer.options);
      } else {
        return acc;
      }
    }, Object.assign({}, transientOpts));
  };

  return {
    stack,
    options: getOptions,
    addOptions,
  };
};

module.exports = createStack;
