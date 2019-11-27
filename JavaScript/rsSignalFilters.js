//--------------------------------------------------------------------------------------------------

/** Constructor of an exponential decay filter */
// maybe use this syntax - it's nicer and closer to c++:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

ExpDecayFilter = function(timeConstant)
{
  this.tau   = timeConstant;
  this.state = 0;
  // maybe move to bottom - implementation details should be irrelevant to client code

  this.getSample = function(x, dt) // x: input value, dt: time-delta between this and previous sample
  {
    if(dt <= 0) // sanity check - we are a bit defensive here
      return x;  
    //var b      = exp(-dt / this.tau);  // verify this formula - decay seems too slow
    var b      = exp(-1 / this.tau);
    //b = 0.25; //test
    var a      = 1 - b;
    var bdt    = Math.pow(b, dt);
    this.state = a * x + bdt * this.state;
    return this.state;
  }
  // maybe this should be put into the prototype
  // todo: move this into a file rsSignalFilters.js and make a test script and html file that plots
  // the impulse response with grafica

  // maybe instead of the the update formula with bdt, simply use the naive formula with recomputed b
  // we shall *not* recompute b *and* use the bdt update formula - it's either/or
  // has no normalization - implement with normalization - see c++ implementation of rsNonUniformOnePole

  this.reset = function()
  {
    this.state = 0;
  }
}


// todo make a file rsSignalOscillators/Sources
// make classes for rsImpulseGenerator, rsSawOscillator