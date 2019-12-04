/** Library to create various parametric curves. */

// todo: follow the following convention: the first parameter is always the curve parameters t 
// normalized to the range 0..1. Additional parameters may be used to control the shape of the 
// curve...if the number of parameters beocmes unwieldy for functions, use objects and setters


/** Returns a sinusoidal function with unit period, i.e. the period is 1 rather than 2*PI as it
would be for the regular sine function. 
@param {number} x - Argument, typically in the range 0..1 */
function rsSin1(x)
{
  return Math.sin(2*PI*x); 
}

/** Computes a unit-period sine wave that goes through a tanh waveshaper. The amplitude loss due to
the waveshaping is compensated for such that the final wave has unit amplitude again.  
@param {number} x - Argument, typically in the range 0..1
@param {number} [d=0] - Drive - the higher, the more squarewave-like the output becomes. */
function rsSaturatedSine(x, d=0)
{
  if(d == 0)
    return rsSin1(x);
  else
    //return Math.tanh(d * rsSin(x)) / Math.abs(Math.tanh(d));
    return Math.tanh(d * rsSin1(x)) / Math.abs(Math.tanh(d));
    // somehow this abs doesn't seem to work as expected - when moving drive through zero, there's
    // a discontinuous jump ...hmm...well...maybe that should be expected
}
// in addition to waveshaping of the output sinusoid, also try phase-shaping of the sinusoid's 
// argument - maybe try symmetric as well as asymmetric shaping functions