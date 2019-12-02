//--------------------------------------------------------------------------------------------------

/** Constructor of an exponential decay filter */
// maybe use this syntax - it's nicer and closer to c++:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
// on the other hand, using this class-based syntax may obscure the fact that in JS there actually
// are no classes - inheritance in JS is based on prototypes and it's probably a good idea to use
// a syntax that reflects that - anything else may be misleading.

ExpDecayFilter = function(timeConstant)
{
  this.tau   = timeConstant;
  this.state = 0;
  // maybe move to bottom - implementation details should be irrelevant to client code

  this.reset = function()
  {
    this.state = 0;
  }
}

ExpDecayFilter.prototype.getSample =
function(x, dt) // x: input value, dt: time-delta between this and previous sample
{
  if(dt <= 0) // sanity check - we are a bit defensive here
    return x;  
  var b = Math.exp(-1 / this.tau); // verify this formula - decay seems too slow
  var a = 1 - b;
  var bdt = Math.pow(b, dt);
  this.state = a * x + bdt * this.state;
  return this.state;
};
  // maybe this should be put into the prototype
  // todo: move this into a file rsSignalFilters.js and make a test script and html file that plots
  // the impulse response with grafica

  // maybe instead of the the update formula with bdt, simply use the naive formula with recomputed b
  // we shall *not* recompute b *and* use the bdt update formula - it's either/or
  // has no normalization - implement with normalization - see c++ implementation of rsNonUniformOnePole


// todo make a file rsSignalOscillators/Sources
// make classes for rsImpulseGenerator, rsSawOscillator