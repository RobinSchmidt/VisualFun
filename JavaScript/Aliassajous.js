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
  rsCurve(t => [s*sin( n*t   ), s*sin( m*t+PI)], a, b, numLines);
  rsCurve(t => [s*sin( m*t+PI), s*sin( n*t   )], a, b, numLines);
  rsCurve(t => [s*sin(-n*t   ), s*sin(-m*t+PI)], a, b, numLines);
  rsCurve(t => [s*sin(-m*t+PI), s*sin(-n*t   )], a, b, numLines);
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

  // todo: make them adjustable via dat.gui.js, see here:
  // https://www.youtube.com/watch?v=x2izqg3fmX4&list=PLb0zKSynM2PBMF67Fo_18vshTDgGf4oyc&index=5


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
//  use a function rsSaturatedSine(x, drive)
// -show an optionla counter for taking notes, when interesting things happen
// -maybe give the user a slider to manually adjust length
// -add parameter for color (hue), select actual colors via hsl or hsv
// -respond to certain key-hits with setting tEnd to certain values

// Observations for n=2, m=3:
// -when tEnd == numLines, it starts over again - we only need to look at the range
//  tEnd = 0...NumLines - outside that, all patterns repeat
// -when numlines is "nicely" divisible by tEnd, we get interesting patterns
// -i think, the pattern has the most symmetric appearance, when the gcd of NumLines and tEnd is 
//  large
// -the shape of the pattern seems to depend on the quotient NumLines/tEnd
//  60/30, 60/45, 60/15: cross, 60/20: roof, 60/24: pentagons
//  other interesting shapes: 60/18, 60/12
//  -this seems to suggest, that highly compostive numbers (such as 60) are a good choice for
//   NumLines
// -when removing all but one of the rsCurve calls in rsLissajous, thereby removing the 
//  artificially enforced symmetry, we get the following shapes:
//  60/12, 60/48: pentagram, 60/15: centered line, 60/18,60/42,90/63: zig-zag-polygon, 
//  60/20, 60/40: top-right line, 
//  60/24, 60/36, 90/54: pentagon
//  nice unnamed shapes: 60/50, 60/54, 60/55, 60/56, 60/57, 90/75, 90/9, 90/10, 90/15
//  75/60, 90/72, 90/18: pentagram

// todo:
// -use transitions between nice symmetric patters that are close to each other, like 
//  60/54 and 60/55
// -let shapes rhythmically oscillate around a nice pattern
//  -maybe it should be some sort of oscillation that gets damped over time and triggered by beats
//   (or every 2nd or 4th beat)
// -smaller number of lines look actually also quite nice - a bit like robot arms - maybe we should
//  emphasize the "joints" by drawing circles at the line-ends

//--------------------------------------------------------------------------------------------------
// implementation of p5.js callbacks:

function setup() 
{
	createCanvas(windowWidth, windowHeight);
	// todo: figure out brwoser window size and use the available space

  var gui = new dat.GUI();
  gui.add(settings, "NumLines",  1, 200, 1);
  gui.add(settings, "Speed",  -2, 2, 0.0001);
  gui.add(settings, "OffsetCoarse", 0, 100, 1);
  gui.add(settings, "OffsetFine", -1, 1, 0.0001);
}

function draw() 
{
	rsAliassajous();
}




// for dat.gui:
// https://www.youtube.com/watch?v=x2izqg3fmX4&feature=youtu.be&list=PLb0zKSynM2PBMF67Fo_18vshTDgGf4oyc

// -maybe it's possible to make my own version of dat.gui that includes: 
//  -parameter mappers for sliders
//  -use shift and/or mouse-wheel for fine-tuning, ctrl for reset (or the other way around