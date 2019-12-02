//--------------------------------------------------------------------------------------------------

/** Constructor of an exponential decay filter */
ExpDecayFilter = function(timeConstant)
{
  this.tau = timeConstant;
  this.state = 0;
}
// maybe use rs-Prefix ...but maybe capitalized RsExpDecayFilter to indicate a class?
// maybe avoid recomputing the coefficient in getSample - in this case, we should probably use an 
// underscore: this._tau to indicate that client code should not alter that directly and instead 
// call a method setTimeConstant which re-computes the coefficient - problem: then, we could not 
// simply modify it via dat.gui ...hmmm - maybe it's not such a big deal to re-compute the coeff 
// each frame - the actual drawing probably dwarfs the computations needed for that

/** Compues one output sample at a time for the exponential decay filter. 
x: input value, dt: time-delta between this and previous sample */
ExpDecayFilter.prototype.getSample = function(x, dt) 
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


//--------------------------------------------------------------------------------------------------
// A filter that realizes an attack/decay envelope

AttackDecayFilter = function(attack, decay)
{
  this.attack = attack;
  this.decay  = decay;
  this.attFlt = new ExpDecayFilter(this.attack);
  this.decFlt = new ExpDecayFilter(this.decay);
}

AttackDecayFilter.prototype.getSample = function(x, dt) 
{
  this.attFlt.timeConstant = this.attack;
  this.decFlt.timeConstant = this.decay;
  return this.attFlt.getSample(this.decFlt.getSample(x, dt), dt);
}
// ToDo: 
// -to compute the time-constants of both filters, use formulas that ensure that the peak is
//  at unity
// -currently, we use a series connection - maybe use a parallel connection instead.
// -ok - this returns crap - probably because we don't use the normalization schemes in 
//  ExpDecayFilter - figure this out by plotting the step response - this typically exposes the 
//  problems







// todo make a file rsSignalOscillators/Sources
// make classes for rsImpulseGenerator, rsSawOscillator