var tape = require('tape'),
    before = tape,
    after = tape,
    test = beforeEach(tape, function (assert) {
      assert.end();
    }),
    test = afterEach(test, function (assert) {
      assert.end();
    })
    negator = require('../negator');

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

  assert.true(isNotUnderAge(), 'f() should return false');
  assert.end();
});

test('negator() simple use passing context', function (assert) {
  var person = {
    firtName: 'John',
    lastName: 'Connor',
    age: 17,
    isUnderAge: function isUnderAge() { return this.age < 18 }
  };

  var isNotUnderAge = negator(person, function () { return this.isUnderAge(); });

  assert.false(isNotUnderAge(), 'f() should return false');
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
