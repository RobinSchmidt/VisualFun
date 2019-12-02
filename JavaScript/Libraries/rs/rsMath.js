






// how to create modules, see:
// https://www.jvandemo.com/a-10-minute-primer-to-javascript-modules-module-formats-module-loaders-and-module-bundlers/
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
// https://www.freecodecamp.org/news/javascript-modules-a-beginner-s-guide-783f7d7a5fcc/
// https://www.sitepoint.com/understanding-module-exports-exports-node-js/
// https://juristr.com/blog/2017/03/angular-modules-vs-es6-modules/



/** Given two arrays x and y of the same length where x contains the abscissa values and y contains
the ordinate values, this function returns the numeric integral of y (at the same x-values) 
computed via trapezoidal integration. The optional c is the integration constant which is also the
lower integration limit when the output function is viewd as definite integral from c to x. */
function rsIntegralTrapezoidal(x, y, c=0)
{
  // rsAssert(x.length == y.length)
  var xo, yo, zo, tmp, n;
  var yi = [];  // maybe we can pre-allocate the memory?
  xo = x[0]; yo = y[0]; zo = c; yi[0] = zo;    // "old" values (at index n-1)
  for(n = 1; n < x.length; n++) {
    tmp = zo + (x[n]-xo)*(y[n]+yo)*0.5;        // compute integral by trapezoidal rule
    xo = x[n]; yo = y[n]; zo = tmp;            // update integrator state variables
    yi[n] = tmp;                               // write integral to output array
  }
  return yi;
}
// not yet tested