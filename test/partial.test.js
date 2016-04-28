var tape = require('tape'),
    before = tape,
    after = tape,
    test = beforeEach(tape, function (assert) {
      assert.end();
    }),
    test = afterEach(test, function (assert) {
      assert.end();
    })
    partial = require('../lambdax').partial;

test('partial() simple use passing params', function (assert) {
  var sumPlus15 = partial(function (a, b, c) { return a + b + c; }, 15);
  var actual = sumPlus15(25, 20);
  var expected = 60

  assert.equal(actual, expected, 'actual should be equal to expected');
  assert.end();
});

test('partial() simple use passing context and arguments', function (assert) {
  var minAge = 18;
  var maxAge = 30;
  var getJohnColeguesNames = partial(
    john,
    function (people) {
      var _self = this;
      return people.reduce(function (colegues, person) {
        if (person.occupation === _self.occupation) {
          colegues.push(person.firstName);
        }

        return colegues;
      }, []);
    }
  );

  var actual = getJohnColeguesNames(people);
  var expected = ['Francis', 'Modesto'];
  assert.deepEqual(actual, expected, 'the names should be Francis and Modesto');
  assert.end();
});

test('partial() use as a builder', function (assert) {
  var findBackendDeveloper = partial()
    .expression(function () {
      return this.reduce(function (backendDevelopers, person) {
        if (person.occupation === 'Backend Developer') {
          backendDevelopers.push(person);
        }

        return backendDevelopers;
      }, []);
      return this.age >= minAge && this.age <= maxAge;
    })
    .context(people)
    .build();

  var actual = findBackendDeveloper();
  var expected = people.filter(function (x) { return x.occupation === 'Backend Developer' });

  assert.deepEqual(actual, expected, 'should find only backend developers');
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
  firstName: 'John',
  lastName: 'Connor',
  age: 17,
  occupation: 'Backend Developer',
  isUnderAge: function isUnderAge() { return this.age < 18 }
};

var people = [
  {
    firstName: 'Francis',
    lastName: 'Brito',
    age: 21,
    occupation: 'Backend Developer',
  },
  {
    firstName: 'Michael',
    lastName: 'Castro',
    age: 22,
    occupation: 'FrontEnd Developer',
  },
  {
    firstName: 'Modesto',
    lastName: 'Figuereo',
    age: 22,
    occupation: 'Backend Developer',
  },
  {
    firstName: 'Onil',
    lastName: 'Pereyra',
    age: 36,
    occupation: 'CTO',
  },
]
