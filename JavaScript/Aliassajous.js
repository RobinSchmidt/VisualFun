tEnd = 0; // a global variable for the endpoint of our curve
// can be tweaked to "fast-forward" at 50, something interesting happens
// rename to numCycles or curveLength

//-------------------------------------------------------------------------------------------------
// code that may be factored out into a library at some point:

function rsLines(points)
{
  for(var i = 0; i < points.length-1; i++)
    line(points[i][0], points[i][1], points[i+1][0], points[i+1][1]);
}

function rsCurve(f, a, b, n = 200)
{
  rsLines([...Array(n+1).keys()].map(k => f(a + (b-a) * k/n)));
}

function rsSaturatedSine(x, drive=0)
{
  if(drive == 0)
    return sin(x);
  else
    return tanh(drive * sin(x)) / tanh(drive);
}

//-------------------------------------------------------------------------------------------------
// code specifically for this page (try to minimize this code, i.e. try to factor out stuff into
// "library" code)

function rsLissajous(n, m, numLines, a, b, drive)
{
  s = -1;
  rsCurve(t => [s*rsSaturatedSine( n*t,     drive), s*rsSaturatedSine( m*t+PI, drive)], a, b, numLines);
  rsCurve(t => [s*rsSaturatedSine( m*t+ PI, drive), s*rsSaturatedSine( n*t,    drive)], a, b, numLines);
  rsCurve(t => [s*rsSaturatedSine(-n*t,     drive), s*rsSaturatedSine(-m*t+PI, drive)], a, b, numLines);
  rsCurve(t => [s*rsSaturatedSine(-m*t+PI,  drive), s*rsSaturatedSine(-n*t,    drive)], a, b, numLines);
  // re-factor to avoid the code duplication!
}

// User parameters - some of them can be controlled by the GUI:
settings = 
{ 
  NumLines: 75,
  Speed: 0,
  OffsetCoarse: 0,
  OffsetFine: 0,
  ShowIntervalEnd: true  // for figuring out, where interesing things happen
}

function rsAliassajous()
{
  // maybe factor out into rsSetupPlot:
  translate(width/2, height/2);             // puts origin at the center of the canvas
  let scaleFactor = min(width,height)/3;    // number of pixels for a unit distance
  scale(scaleFactor, scaleFactor)           // the minus for the y-axis let's the y-axis go upward
  rotate(PI / 4.0);

  // user parameters:
  var numLines = settings.NumLines;  
  var freq     = settings.Speed;
  var n = 2; 
  var m = 3;




  background(0)  

  var end = 2*PI*(tEnd + settings.OffsetCoarse + settings.OffsetFine);

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
    text(end, 0, 0);
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
  gui.add(settings, "NumLines",      1, 200, 1);
  gui.add(settings, "Speed",        -2,   2, 0.0001);
  gui.add(settings, "OffsetCoarse",  0, 100, 1);
  gui.add(settings, "OffsetFine",   -1,   1, 0.0001);
}

function draw() 
{
  rsAliassajous();
}
