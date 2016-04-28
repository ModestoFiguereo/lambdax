var tape = require('tape'),
    before = tape,
    after = tape,
    test = beforeEach(tape, function (assert) {
      assert.end();
    }),
    test = afterEach(test, function (assert) {
      assert.end();
    })
    negator = require('../lambda').negator;
    partial = require('../lambda').partial;

test('negator() simple use', function (assert) {
  var f = negator(function () { return true });
  var t = negator(function () { return false });

  assert.false(f(), 'f() should return false');
  assert.true(t(), 'v() should return true');
  assert.end();
});

test('negator() simple use passing arguments', function (assert) {
  function isUnderAge(age) { return age < 18 }

  var isNotUnderAge = negator(isUnderAge, 25);

  assert.true(isNotUnderAge(), 'isNotUnderAge() should return true');
  assert.end();
});

test('negator() simple use passing context', function (assert) {
  var isNotUnderAge = negator(john, function () { return this.isUnderAge(); });

  assert.false(isNotUnderAge(), 'isNotUnderAge() should return false');
  assert.end();
});

test('negator() simple use passing context and arguments', function (assert) {
  var minAge = 18;
  var maxAge = 30;
  var isNotAgeInRange = negator(
    john,
    function (minAge, maxAge) {
      return this.age >= minAge && this.age <= maxAge;
    },
    minAge
    // we could've passed maxAge too,
    // but we didn't just to demonstrate that can pass it latter
  );

  assert.true(isNotAgeInRange(maxAge), 'isAgeInRange() should return true');
  assert.end();
});

test('negator() use as a builder', function (assert) {
  var isNotAgeInRange = negator()
    .expression(function (minAge, maxAge) {
      return this.age >= minAge && this.age <= maxAge;
    })
    .context(john)
    .argument(18)
    .argument(30)
    .build();

  assert.true(isNotAgeInRange(), 'isAgeInRange() should return true');
  assert.end();
});

test('negator() use as a builder with a collection of people', function (assert) {
  var minAge = 18;
  var maxAge = 30;
  var isNotAgeInRangeBuilder = negator()
    .expression(function (minAge, maxAge) {
      return this.age >= minAge && this.age <= maxAge;
    })
    .argument(minAge)
    .argument(maxAge);

  for (var person in people) {
    var isNotAgeInRange = isNotAgeInRangeBuilder
      .context(people[person])
      .build();

    if (people[person].age >= minAge && people[person].age <= maxAge) {
      assert.false(isNotAgeInRange(), 'isAgeInRange() should return false for ' + people[person].firtName);
    } else {
      assert.true(isNotAgeInRange(), 'isAgeInRange() should return true for ' + people[person].firtName);
    }
  }

  assert.end();
});

function beforeEach(t, handler) {
  return function tapish(name, listener) {
    t(name, function (assert) {
      var _end = assert.end;
      assert.end = function () {
        assert.end = _end;
        listener(assert);
      };

      handler(assert);
    });
  };
}

function afterEach(t, handler) {
  return function tapish(name, listener) {
    t(name, function (assert) {
      var _end = assert.end;
      assert.end = function () {
        assert.end = _end;
        handler(assert);
      };

      listener(assert);
    });
  };
}

var john = {
  firtName: 'John',
  lastName: 'Connor',
  age: 17,
  isUnderAge: function isUnderAge() { return this.age < 18 }
};

var people = [
  {
    firtName: 'Francis',
    lastName: 'Brito',
    age: 21,
  },
  {
    firtName: 'Michael',
    lastName: 'Castro',
    age: 22,
  },
  {
    firtName: 'Modesto',
    lastName: 'Figuereo',
    age: 22,
  },
  {
    firtName: 'Onil',
    lastName: 'Pereyra',
    age: 36,
  },
]
