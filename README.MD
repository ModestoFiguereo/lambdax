# lambdax
`lambdax` is an small module that allows you to implement partial application and build lambda expressions.

## Install

- npm
```sh
npm install --save lambdax
```
- bower
```sh
bower install --save lambdax
```

## Usage

`lambdax` exposes two functions:  `partial()` and `negate()`;

```js
var partial = require('../lambdax').partial;
var negate = require('../lambdax').negate;
```

### partial()
- partial() simple use:

```js
function sum(a, b, c) {
  return a + b + c;
}
var sumPlus15 = partial(sum, 15);
sumPlus15(25, 20); // => 60
```

- partial() simple use passing context and arguments:

```js

function getColeguesNamesFromPeople(people) {
  var _self = this;
  return people.reduce(function (colegues, person) {
    if (person.occupation === _self.occupation) {
      colegues.push(person.firstName);
    }

    return colegues;
  }, []);
}

var getJohnColeguesNamesFromPeople = partial(
  john, // context
  getJohnColeguesNamesFromPeople,
);

getJohnColeguesNamesFromPeople(people);
```

- partial() use as a builder:

```js
var findBackendDeveloper = partial()
  .expression(function () {
    return this.reduce(function (backendDevelopers, person) {
      if (person.occupation === 'Backend Developer') {
        backendDevelopers.push(person);
      }

      return backendDevelopers;
    }, []);
  })
  .context(people)
  .build();

findBackendDeveloper();
```

### negate()

- negate() simple use

```js
var f = negate(function () { return true });
f() // => false.
```

- negate() simple use passing context and arguments:

```js
var minAge = 18;
var maxAge = 30;
var isAgeNotInRange = negate(
  john, // context
  function (minAge, maxAge) {
    return this.age >= minAge && this.age <= maxAge;
  },
  minAge
  // we could've passed maxAge too,
  // but we didn't just to demonstrate that can pass it latter
);

isAgeNotInRange(maxAge);
```

- negate() use as a builder:

```js
var isNotAgeInRange = negate()
  .expression(function (minAge, maxAge) {
    return this.age >= minAge && this.age <= maxAge;
  })
  .context(john)
  .argument(18)
  .argument(30)
  .build();

isNotAgeInRange();
```

**Note:** see test folder for more examples.
