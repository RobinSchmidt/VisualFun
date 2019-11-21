tEnd = 0; // a global variable for the endpoint of our curve
// can be tweaked to "fast-forward" at 50, something interesting happens
// rename to numCycles

function rsLines(points)
{
	for(var i = 0; i < points.length-1; i++)
    line(points[i][0], points[i][1], points[i+1][0], points[i+1][1]);
}

function rsCurve(f, a, b, n = 200)
{
	rsLines([...Array(n+1).keys()].map(k => f(a + (b-a) * k/n)));
}

function rsLissajous(n, m, numLines, a, b)
{
	s = -1;
  rsCurve(t => [s*sin( n*t), s*cos( m*t)], a, b, numLines);
  rsCurve(t => [s*cos( m*t), s*sin( n*t)], a, b, numLines);
  rsCurve(t => [s*sin(-n*t), s*cos(-m*t)], a, b, numLines);
  rsCurve(t => [s*cos(-m*t), s*sin(-n*t)], a, b, numLines);
}

settings = 
{ 
  Speed: 1/16,
  ShowIntervalEnd: true
}

function rsAliassajous()
{
	// maybe factor out into rsSetupPlot:
	translate(width/2, height/2);             // puts origin at the center of the canvas
	let scaleFactor = min(width,height)/3;    // number of pixels for a unit distance
	scale(scaleFactor, scaleFactor)           // the minus for the y-axis let's the y-axis go upward
	rotate(PI / 4.0);

  // user parameters:
  //var period = 16; // period of repitition in seconds
                   // maybe change to "initialSpeed" or use freq

  //var freq = 1/16;
  var freq = settings.Speed;

  var n = 2; 
  var m = 3;
  var numLines = 75;
  // todo: make them adjustable via dat.gui.js, see here:
  // https://www.youtube.com/watch?v=x2izqg3fmX4&list=PLb0zKSynM2PBMF67Fo_18vshTDgGf4oyc&index=5


	background(0)  



	strokeWeight(12/scaleFactor)
	stroke(255, 75, 200, 30);
	rsLissajous(n, m, numLines, 0, 2*PI*tEnd)

  strokeWeight(6/scaleFactor)
	stroke(200, 75, 255, 60);
	rsLissajous(n, m, numLines, 0, 2*PI*tEnd)

	strokeWeight(1/scaleFactor)
	stroke(255, 255, 255, 120);
	rsLissajous(n, m, numLines, 0, 2*PI*tEnd)

  // factor out the 3 calls into 1


  // this text is still at the wrong position, rotated 45° and shows too many digits
  if(settings.showIntervalEnd)
  {
    fill("white");                 // text should be filled - outlines are ugly
    textSize(0.05);                 // what unit is this?  
    text(tEnd, 0, 0);
    noFill();
  }


  // compute time increment based on frame rate and desired periodicty:
  dt =  freq / frameRate();
  if(!isFinite(dt)) // sanity check necessary - it seems, frameRate may sometimes return 0
  	dt = 0.01;

  dt *= 1 / (1+tEnd*freq); // slow down over time to counteract vertex acceleration
  // seems like 1 / (1+tEnd/period) is a good choice

  // update counter with wrap around:
  tEnd = tEnd + dt;
  //tEnd %= 30;
}

// todo: 
// -optionally display the curve length tEnd
// -to figure out an appropriate function, tweak the start-value of tEnd - try values 0, 50, 100
//  and try to find a function that works well for all 3 values - maybe it should be something 
//  like: dt = a / (b + c*tEnd + d*tEnd^2)...so maybe something like
//  dt = a / (b + c*sqrt(tEnd) + d*tEnd) would be more appropriate -> needs experimentation
//  ...i think, asymptotically, it should behave like k/tEnd some k
// -can we have the glow/decay behavior of the oscilloscope?
// -mix in sinusoids of higher frequency 
// -try something like spirograph images
// -try other waveshapes - maybe use tanh of sin - should give some sort of smooth stop-and-go
// -show an optionla counter for taking notes, when interesting things happen
// -maybe give the user a slider to manually adjust length
// -add parameter for color (hue), select actual colors via hsl or hsv
// -respond to certain key-hits with setting tEnd to certain values


//--------------------------------------------------------------------------------------------------
// implementation of p5.js callbacks:

function setup() 
{
	createCanvas(windowWidth, windowHeight);
	// todo: figure out brwoser window size and use the available space

  var gui = new dat.GUI();
  gui.add(settings, "Speed", -2, 2, 0.0001);
}

function draw() 
{
	rsAliassajous();
}




// for dat.gui:
// https://www.youtube.com/watch?v=x2izqg3fmX4&feature=youtu.be&list=PLb0zKSynM2PBMF67Fo_18vshTDgGf4oyc

// -maybe it's possible to make my own version of dat.gui that includes: 
//  -parameter mappers for sliders
//  -use shift and/or mouse-wheel for fine-tuning