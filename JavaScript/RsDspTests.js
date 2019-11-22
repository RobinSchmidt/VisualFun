// global variables - maybe wrap into object rsTimeInfo:
rsFrameRate   = 0;
rsElapsedTime = 0;  // elapsed time (in seconds) since intialization
rsTimeDelta   = 0;








//--------------------------------------------------------------------------------------------------
// Library functions under construction (are moved to rs.dsp.js, when finished):

/** Constructor of an exponentaial decay filter

*/

ExpDecayFilter = function(timeConstant)
{
  this.tau   = timeConstant;
  this.state = 0;

  this.getSample = function(x, dt) // x: input value, dt: time-delta between this and previous sample
  {
    var b = 0.125;  
    var a = 1-b;
    // prelimiary - todo: compute coeffs from timeConstant (factor out computation function)

    var bdt = Math.pow(b, dt);

    this.state = a * x + bdt * this.state;
  
    return this.state;
  }
  // has no normalization - implement with normalization - see c++ implementation of rsNonUniformOnePole


  this.reset = function()
  {
    this.state = 0;
  }
}

// make classes for rsImpulseGenerator, rsSawOscillator


//--------------------------------------------------------------------------------------------------
// Test and experimentation functions:

rsTimeCounter = 0;
flt = new ExpDecayFilter(1.0); // time-constant tau is 1.0 seconds (time constant not yet functional)

// maybe put to top

function rsTestExpDecayFilter()
{
  var period = 3;
  var time   = rsElapsedTime % period;

  background(0);


  // Generate the peridic impulses (factor out into a class rsImpulseGenerator (but maybe make it 
  // better - spread impulses over two frames according to rsTimeDelat-period):
  var impulse = 0;
  rsTimeCounter += rsTimeDelta;
  if(rsTimeCounter >= period)
  {
    impulse = 1;
    rsTimeCounter -= period;
  }

  // filter the impulse:
  var filteredImpulse = flt.getSample(impulse, rsTimeDelta);



  // todo: draw a circle with radius proportional to filteredImpulse











  // print out time info (factor out int rsPrintTimeInfo):
  var xKey   = 10;
  var xValue = 90;
  var y      = 20;
  var dy     = 16;
  fill("white");
  text("Frame Rate:",              xKey,   y);
  text(rsFrameRate.toFixed(1),     xValue, y);
  y += dy;
  text("Time Delta:",              xKey,   y);
  text(rsTimeDelta.toFixed(3),     xValue, y);
  y += dy;
  text("Elapsed Time:",            xKey,   y);
  text(rsElapsedTime.toFixed(1),   xValue, y);
  y += dy;
  text("Time Counter:",            xKey,   y);
  text(time.toFixed(1),            xValue, y);


  // print out value of the filtered impulse:
  y += dy;
  y += dy;
  text("Impulse:",                 xKey,   y);
  text(filteredImpulse.toFixed(4), xValue, y);
}




//--------------------------------------------------------------------------------------------------
// Implementation of p5.js callbacks:

function setup() 
{
  createCanvas(windowWidth, windowHeight);
}

function draw() 
{
  // update global time variables (maybe factor out into rsUpdateTimeInfo)
  rsFrameRate = frameRate();
  if(rsFrameRate > 0)
    rsTimeDelta = 1/rsFrameRate;
  else
    rsTimeDelta = 0;
  rsElapsedTime += rsTimeDelta;  


  rsTestExpDecayFilter();



}