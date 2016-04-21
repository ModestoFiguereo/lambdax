(function (name, global, definition) {
  if (typeof module !== 'undefined') {
    module.exports = definition();
  } else if (typeof global.require !== 'undefined' && typeof global.require.amd === 'object') {
    global.define(definition);
  } else {
    global[name] = definition();
  }
})('negator', this, function () {
  function negator(context, fn) {
    if (!arguments.length) {
      return Object.create(negatorBuilderProto);
    }

    var args = [].slice.apply(arguments, [2]);
    if (!context || typeof context === 'function') {
      args.unshift(fn);
      fn = context;
    }

    return function () {
      var moreArgs = [].slice.apply(arguments, [0]);

      return !fn.apply(context || {}, args.concat(moreArgs));
    }
  }

  var negatorBuilderProto = {
    __arguments: [],
    __context: null,
    __expression: null,
    expression: function expression(fn) {
      this.__expression = fn;
      return this;
    },
    context: function context(ctx) {
      this.__context = ctx;
      return this;
    },
    argument: function argument(arg) {
      this.__arguments.push(arg);
      return this;
    },
    build: function build() {
      var args = [this.__context, this.__expression].concat(this.__arguments);
      return negator.apply({}, args);
    },
  };

  return negator;
});
