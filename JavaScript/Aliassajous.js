// Bugs:
// -somehow, the speed seems to be too high

tEnd = 0; // a global variable for the endpoint of our curve
// can be tweaked to "fast-forward" at 50, something interesting happens
// rename to numCycles or curveLength

//=================================================================================================
// code that may be factored out into a library at some point 

//-------------------------------------------------------------------------------------------------
// Library functions that have no external dependencies:

/** Returns a sinusoidal function with unit period, i.e. the period is 1 rather than 2*PI as it
would be for the regular sine function. 
@param {number} x - Argument, typically in the range 0..1 */
function rsSin(x)
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
    return rsSin(x);
  else
    //return Math.tanh(d * rsSin(x)) / Math.abs(Math.tanh(d));
    return Math.tanh(d * rsSin(x)) / Math.abs(Math.tanh(d));
    // somehow this abs doesn't seem to work as expected - when moving drive through zero, there's
    // a discontinuous jump ...hmm...well...maybe that should be expected
}

/** Creates the array of vertices for a parametric curve (x,y) = f(t) in the interval t = a..b with
n sample points/vertices.
@param {function}  f - The function that takes the parameter t and returns a 2D point.
@param {number}    a - Start of the interval for t.
@param {number}    b - End of the interval for t.
@param {number}    n - Number of sample points.     */
function rsCurveVertices(f, a, b, n)
{
  return [...Array(n+1).keys()].map(k => f(a + (b-a) * k/n));
}
// actually, i think f could also return a 3D point
// ..hmm - actually, it produces n+1 vertices, if f is perdiodic with period b-a, the last one will
// be the same as the first and the curve will be closed

//-------------------------------------------------------------------------------------------------
// Library functions that depend of p5.js:

/** Draws a bunch of lines from an array of points/vertices. Note that with transparency, this will
look different from drawing the same array of vertices using 
beginShape();vertex();vertex()...,;endShape(); even with noFill because at the joints of the lines, 
pixels will be drawn twice. 
@param {Array} p - An array of points/vertices */
function rsLines(p)
{
  for(var i = 0; i < p.length-1; i++)
    line(p[i][0], p[i][1], p[i+1][0], p[i+1][1]);
}

/** Draws a parametric curve (x,y) = f(t) in the interval t = a..b with n sample points 
@param {function}  f - The function that takes the parameter t and returns a 2D point.
@param {number}    a - Start of the interval for t.
@param {number}    b - End of the interval for t.
@param {number}   [n=200] - Number of sample points.     */
function rsCurveWithLines(f, a, b, n = 200)
{
  rsLines(rsCurveVertices(f, a, b, n));
}
// factor out a function that returns the vertex-array - maybe rsCurveVertices



//=================================================================================================
// Code specifically for this page (try to minimize this code, i.e. try to factor out stuff into
// "library" code)

// User parameters - some of them can be controlled by the GUI:
settings = 
{ 
  NumLobesX: 3,
  NumLobesY: 2,
  NumLines: 75,
  Speed: 0,
  OffsetCoarse: 0,
  OffsetFine: 0,
  Drive: 0,
  ShowIntervalEnd: true  // for figuring out, where interesing things happen
}


function rsLissajous(n, m, numLines, a, b)
{
  drive = settings.Drive;
  s = 1;
  p = 1/4;   // make parameter phaseDelta
  rsCurveWithLines(t => [s*rsSaturatedSine( n*t,   drive), s*rsSaturatedSine( m*t+p, drive)], a, b, numLines);
  rsCurveWithLines(t => [s*rsSaturatedSine( m*t+p, drive), s*rsSaturatedSine( n*t,   drive)], a, b, numLines);

  //rsCurveWithLines(t => [-s*rsSaturatedSine( n*t, drive), s*rsSaturatedSine( m*t+p, drive)], a, b, numLines);


  // this should be done by a function rsSymmetrize(array, N)
  //rsCurveWithLines(t => [s*rsSaturatedSine(-n*t,   drive), s*rsSaturatedSine(-m*t+p, drive)], a, b, numLines);
  //rsCurveWithLines(t => [s*rsSaturatedSine(-m*t+p, drive), s*rsSaturatedSine(-n*t,   drive)], a, b, numLines);
  // re-factor to avoid the code duplication! make a function rsCurveSymmetrized(f, a, b, n)
}
// actually, we can get rid of many of the parameters because we may get them from the global settings object



function rsAliassajous()
{
  // maybe factor out into rsSetupPlot:
  translate(width/2, height/2);             // puts origin at the center of the canvas
  var scaleFactor = min(width,height)/2/sqrt(2);    // number of pixels for a unit distance
  scale(scaleFactor, scaleFactor)           // the minus for the y-axis let's the y-axis go upward

  rotate(PI / 4.0); // maybe get rid of that - apply rotations internally in rsLissajous
  //scaleFactor *= sqrt(1/2); // when rotating, we can't use the full space
  //scaleFactor /= 4;

  // user parameters:
  var numLines = settings.NumLines;  
  var freq     = settings.Speed;
  var n        = settings.NumLobesY;
  var m        = settings.NumLobesX;

  // test - try to decouple overall speed from number of lobes:
  freq /= sqrt(n*n + m*m);

  background(0)  

  //var end = 2*PI*(tEnd + settings.OffsetCoarse + settings.OffsetFine);
  var end = tEnd + settings.OffsetCoarse + settings.OffsetFine;

  strokeWeight(12/scaleFactor)
  stroke(255, 75, 200, 30);
  rsLissajous(n, m, numLines, 0, end)

  strokeWeight(6/scaleFactor)
  stroke(200, 75, 255, 60);
  rsLissajous(n, m, numLines, 0, end)

  strokeWeight(1/scaleFactor)
  stroke(255, 255, 255, 120);
  rsLissajous(n, m, numLines, 0, end)

  // factor out the 3 calls into 1


  // this text is still at the wrong position, rotated 45° and shows too many digits
  if(settings.ShowIntervalEnd)
  {
    fill("white");                 // text should be filled - outlines are ugly
    textSize(0.05);                 // what unit is this?  
    text(end, -1, 0.99);
    noFill();
  }


  // compute time increment based on frame rate and desired periodicty:
  dt =  freq / frameRate();
  if(!isFinite(dt)) // sanity check necessary - it seems, frameRate may sometimes return 0
    dt = 0.01*freq;

  dt *= 1 / (1+tEnd*freq); // slow down over time to counteract vertex acceleration
  // seems like 1 / (1+tEnd/period) is a good choice

  // update counter with wrap around:
  tEnd = tEnd + dt;
  //tEnd %= 30; // i think, we could do tEnd %= num Lines here - that should not change anything
}

//--------------------------------------------------------------------------------------------------
// implementation of p5.js callbacks:

function setup() 
{
  createCanvas(windowWidth, windowHeight);

  // create and set up the GUI:
  var gui = new dat.GUI();
  gui.add(settings, "NumLobesX",     1,   9, 1);
  gui.add(settings, "NumLobesY",     1,   9, 1);  
  gui.add(settings, "NumLines",      1, 360, 1);
  gui.add(settings, "Speed",        -2,   2, 0.0001);
  gui.add(settings, "OffsetCoarse",  0, 100, 1);
  gui.add(settings, "OffsetFine",   -1,   1, 0.0001);
  gui.add(settings, "Drive",         0,   2, 0.01);
}

function draw() 
{
  rsAliassajous();
}
