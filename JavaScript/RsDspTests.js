// global variables:
elapsedTime = 0;  // elapsed time (in seconds) since intialization








//--------------------------------------------------------------------------------------------------
// Library functions under construction (are moved to rs.dsp.js, when finished):




//--------------------------------------------------------------------------------------------------
// Test and experimentation functions:

function rsTestExpDecayFilter()
{
  var period = 5;
  var time   = elapsedTime % period;

  background(50);


  // print out time info:
  var xKey   = 10;
  var xValue = 90;
  var y      = 20;
  var dy     = 16;
  fill("white");
  text("Elapsed Time:",        xKey,   y);
  text(elapsedTime.toFixed(1), xValue, y);
  y += dy;
  text("Time Counter:",        xKey,   y);
  text(time.toFixed(1),        xValue, y);
}




//--------------------------------------------------------------------------------------------------
// Implementation of p5.js callbacks:

function setup() 
{
  createCanvas(windowWidth, windowHeight);
}

function draw() 
{
  rsTestExpDecayFilter();


  // update global elapsed time counter:
  var fr = frameRate();
  if(fr > 0)
    elapsedTime += 1/fr;  
}