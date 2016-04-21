(function (name, global, definition) {
  if (typeof module !== 'undefined') {
    module.exports = definition();
  } else if (typeof global.require !== 'undefined' && typeof global.require.amd === 'object') {
    global.define(definition);
  } else {
    global[name] = definition();
  }
})('negator', this, function () {
  function negator (context, fn) {
    var args = [].slice.apply(arguments, [2]);
    if (!context || typeof context === 'function') {
      args.unshift(fn);
      fn = context;
    }

    return function () {
      var moreArgs = [].slice.apply(arguments, [1]);

      return !fn.apply(context || {}, args.concat(moreArgs));
    }
  }

  return negator;
});
