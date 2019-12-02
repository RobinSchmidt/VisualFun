//--------------------------------------------------------------------------------------------------

/** Constructor of an exponential decay filter */
ExpDecayFilter = function(timeConstant)
{
  this.tau = timeConstant;
  this.state = 0;
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
// maybe instead of the the update formula with bdt, simply use the naive formula with recomputed b
// we shall *not* recompute b *and* use the bdt update formula - it's either/or
// has no normalization - implement with normalization - see c++ implementation of rsNonUniformOnePole

ExpDecayFilter.prototype.reset = function() { this.state = 0; };


// todo make a file rsSignalOscillators/Sources
// make classes for rsImpulseGenerator, rsSawOscillator