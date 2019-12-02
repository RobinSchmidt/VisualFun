/** Functions for mathematics including stuff like interpolation, numerical calculus, linear 
algebra, geometry, etc.

Dependencies:
-rsCore.js

ToDo: When the library grows larger, maybe split it into various chunks, like rsLinearAlgebra,
rsNumericCalculus, etc.  */




//-------------------------------------------------------------------------------------------------
// Linear Algebra:

// todo:
// rsSolveLinearSystem, rsSolveTriDiagonalSystem, rsSolvePentaDiagonalSystem, etc.




//-------------------------------------------------------------------------------------------------
// Numerical Calculus:

/** Given two arrays x and y of the same length where x contains the abscissa values and y contains
the ordinate values, this function returns the numeric integral of y (at the same x-values) 
computed via trapezoidal integration. The optional c is the integration constant which is also the
lower integration limit when the output function is viewed as definite integral from c to x. */
function rsIntegralTrapezoidal(x, y, c=0)
{
  rsAssert(x.length == y.length, "rsIntegralTrapezoidal: x- and y-array must have same length");
  let xo = x[0]; 
  let yo = y[0]; 
  let zo = c; 
  let yi = [];       // output array - todo: pre-allocate the memory
  let yi[0] = zo;    // "old" values (at index n-1)
  for(n = 1; n < x.length; n++) {
    tmp = zo + (x[n]-xo)*(y[n]+yo)*0.5;        // compute integral by trapezoidal rule
    xo = x[n]; yo = y[n]; zo = tmp;            // update integrator state variables
    yi[n] = tmp;                               // write integral to output array
  }
  return yi;
}
// not yet tested