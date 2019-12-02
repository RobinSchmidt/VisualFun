// grab bag of potentially useful and/or educational javascript code snippets from various sources

//-------------------------------------------------------------------------------------------------
// Creates a deep copy of an arbitrary array or object (i tested only with arrays so far - array of
// arrays, i.e. matrix, also works)
// code from https://stackoverflow.com/questions/7486085/copy-array-by-value

function copy(aObject) {
  if (!aObject) {
    return aObject;
  }

  let v;
  let bObject = Array.isArray(aObject) ? [] : {};
  for (const k in aObject) {
    v = aObject[k];
    bObject[k] = (typeof v === "object") ? copy(v) : v;
  }

  return bObject;
}

// usage:

a1 = [1,2,3];
a2 = copy(a1); // a2 is a deep copy of a1

// notes:
// another way to create deep copies is: 
a3 = JSON.parse(JSON.stringify(a1))
// but this is probably less performant

//-------------------------------------------------------------------------------------------------
// like JSON.stringify but handles functions, good for creating arbitrary .js objects?
// code from: https://gist.github.com/cowboy/3749767

var stringify = function(obj, prop) {
  var placeholder = '____PLACEHOLDER____';
  var fns = [];
  var json = JSON.stringify(obj, function(key, value) {
    if (typeof value === 'function') {
      fns.push(value);
      return placeholder;
    }
    return value;
  }, 2);
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function(_) {
    return fns.shift();
  });
  return 'this["' + prop + '"] = ' + json + ';';
};

// usage (not yet tested):

var foo = {
  a: function() { return 'a'; },
  b: function() { return 'b'; },
  'bar.baz': {
    'omg ponies!!': function() { return 'c'; }
  }
};

console.log(stringify(foo, 'foo'));

// this["foo"] = {
//   "a": function () { return 'a'; },
//   "b": function () { return 'b'; },
//   "bar.baz": {
//     "omg ponies!!": function () { return 'c'; }
//   }
// };

//-------------------------------------------------------------------------------------------------
// Implementation of a 2D vector class.
// code from: http://weitz.de/files/UebD3.zip (in the Flocking directory)

// constructor
function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

// length (i.e. norm) of the vector
Vector.prototype.magnitude =
  function () {
    // Pythagoras
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

// skalar multiplication
Vector.prototype.mult =
  function (alpha) {
    return new Vector(alpha * this.x, alpha * this.y);
  };

// add another vector
Vector.prototype.add =
  function (vec) {
    return new Vector(vec.x + this.x, vec.y + this.y);
  };

// subtract another vector
Vector.prototype.sub =
  function (vec) {
    return new Vector(this.x - vec.x, this.y - vec.y);
  };

// return a vector with the same direction and length len
// (or 1, if len is not provided)
Vector.prototype.normalize =
  function (len) {
    len = len || 1;
    if (this.magnitude())
      return this.mult(len / this.magnitude());
    else
      return new Vector(this.x, this.y);
  };

  // usage (i think - not tested):

  a = new Vector(1, 2);
  b = new Vector(3, 4);
  c = a.add(b);

  // c == Vector(4,6)