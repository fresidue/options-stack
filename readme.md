# options-stack

A tool to help manage subclassable config/options objects

`npm install options-stack --save`

## usage

Suppose you have a base `pet` options object
```js
const pet = {
  furry: true,
  mammal: true
}
```
but then there are different types of pets
```js
const dog = { canine: true }
const cat = { feline: true }
const iguana = {
  reptile: true,
  mammal: false,
  furry: false
}
```
create a new options stack (with an optional root options object)
```js
const options = require('options-stack')(pet);
```
and add the subclasses to `options` separately:
```js
options.add('dog', dog)
options.add('cat', cat)
options.add('iguana', iguana)
```
or, equivalently, lump them together
```js
options.add({
  dog, cat, iguana
})
```
This package is largely a thinly vieled special use-case of `Object.assign` on top of an array, and in the second case above, the props are added to the array key by key (order not guaranteed).

Adding additional subtypes whenever/dynamically is fine
```js
options.add('gremlin', {
  mammal: false,
  hydrophobic: true
})
```
Then access the specific type as necessary:
```js
const dogOpts = options.get('dog');
// { furry: true, mammal: true, canine: true }
const gremlinOpts = options.get('gremlin')
// { furry: true, mammal: false, hydrophobic: true }
```
Adding a final layer with/upon `get` is supported:
```js
const stripeOpts = options.get('gremlin', {
  canBeMean: true
})
// { furry: true, mammal: false, hydrophobic: true, canBeMean: true }
```
If you want to modify the root object post-creation:
```js
options.addRoot({
  gassy: true
})
```
now
```js
options.get('gremlins').gassy // true
// but..
stripeOpts.gassy //false (not modified by later mutations)
```
Note that `Object.assign` is only used to the top (i.e. named) level. Mutations to any property sub-objects **will** propagate.
```js
const fish = {
  scaly: true
  swims: {in: 'sea'}
};
options.add({fish});
const fishOpts = options.get('fish');
fish.scaly = false;
fishOpts.scaly; // true
fish.swims.in = 'bathtub';
fishOpts.swims.in; // 'bathtub'
```

The `root` config/options object is also accessible:
```js
options.get() // { furry: true, mammal: true, gassy: true }
```
This is also the object returned for any key that does not have any named matches in the stack:
```js
options.get('worm') // { furry: true, mammal: true, gassy: true }
```
