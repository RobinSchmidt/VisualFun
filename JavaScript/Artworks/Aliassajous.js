// Bugs:
// -somehow, the speed seems to be too high

tEnd = 0; // a global variable for the endpoint of our curve
// can be tweaked to "fast-forward" at 50, something interesting happens
// rename to numCycles or curveLength



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
  ShowIntervalEnd: false  // for figuring out, where interesing things happen
}

function rsCreateAliassajousGui()
{
  var gui = new dat.GUI();
  gui.add(settings, "NumLobesX",     1,   9, 1);
  gui.add(settings, "NumLobesY",     1,   9, 1);  
  gui.add(settings, "NumLines",      1, 360, 1);
  gui.add(settings, "Speed",        -2,   2, 0.0001);
  gui.add(settings, "OffsetCoarse",  0, 100, 1);
  gui.add(settings, "OffsetFine",   -1,   1, 0.0001);
  gui.add(settings, "Drive",         0,   2, 0.01);
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

function rsLissajous2(n, m, numLines, a, b)
{
  drive = settings.Drive;
  s = 1;
  p = 1/4;   // make parameter phaseDelta
  rsCurveWithRays(t => [s*rsSaturatedSine( n*t,   drive), s*rsSaturatedSine( m*t+p, drive)], a, b, numLines);
  rsCurveWithRays(t => [s*rsSaturatedSine( m*t+p, drive), s*rsSaturatedSine( n*t,   drive)], a, b, numLines);
}
// uses rays instead of lines - todo: make a general function that takes the rsCurveWithLines/Ray/etc. as
// parameter  - maybe give the user a "DrawMode" combobox



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

  // hmm - the rays are not so interesting - maybe they could be made more interesting, if their
  // center point would also move around via a curve - maybe also an aliased one
  strokeWeight(8/scaleFactor);
  stroke(150, 50, 255, 50);
  rsLissajous2(n, m, numLines, 0, end);


  strokeWeight(12/scaleFactor);
  stroke(255, 75, 200, 30);
  rsLissajous(n, m, numLines, 0, end);

  strokeWeight(6/scaleFactor);
  stroke(200, 75, 255, 60);
  rsLissajous(n, m, numLines, 0, end);

  strokeWeight(1/scaleFactor);
  stroke(255, 255, 255, 120);
  rsLissajous(n, m, numLines, 0, end);

  // factor out the 3 calls into 1

  // let the colors rotate - we need to set them up via HSL or HSV and let H rotate


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
  // maybe try to re-parameterize to a natural parametrization - or generally of different 
  // "warpings" of the parametrization ...maybe FM could be useful for this?
  // trying to compute the arc-length function of (sin(n*t), cos(m*t)):
  // Integrate[ Sqrt[n^2 * Cos[n*t]^2 + m^2 * Sin[m*t]^2] , {t,0,c} ]
  // ..seems like mathematica can't solve this analytically (verify, if the function is actually 
  // correct)....sooo - we need a numerical integration routine - implement trapezoidal 
  // integration - then we need to invert that function - fortunately, it's monotonic
  // try to plot the arc-length function
  // maybe we could also try to re-parametrize it such that in equal time-steps, the rays trace
  // out equal angles? or equal areas...kinda like Kepler's law? ...but the angle is nonmonotonic,
  // so the angle-function is not invertible - but maybe with some trickery (exploting additional
  // information about the previous output value, maybe), we can find the inverse function anyway?
  // ...if there are many possible values, choose the one that is closest to the previous output?
  // or maybe somehow use the curvature to warp the time-parameter?

  // update counter with wrap around:
  tEnd = tEnd + dt;
  //tEnd %= 30; // i think, we could do tEnd %= num Lines here - that should not change anything
}

//--------------------------------------------------------------------------------------------------
// implementation of p5.js callbacks:

function setup() 
{
  createCanvas(windowWidth, windowHeight);
  //createCanvas(windowWidth, windowHeight, WEBGL); // doesn't work on old PC -> try on new
  rsCreateAliassajousGui();
}

function draw() 
{
  rsAliassajous();
}
