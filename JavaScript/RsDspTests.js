// global variables:
elapsedTime = 0;  // elapsed time (in seconds) since intialization
timeDelta   = 0;








//--------------------------------------------------------------------------------------------------
// Library functions under construction (are moved to rs.dsp.js, when finished):

/** Constructor of an exponentaial decay filter

*/

/*
function ExpDecayFilter()
{
  var tau = 1;

  flt =
  {
    foo: 0,  // test

    function: setTimeConstant(newTau) { tau = newTau; },
    function: getSample(dt) 
    {

    }


  }


}

*/



//--------------------------------------------------------------------------------------------------
// Test and experimentation functions:

function rsTestExpDecayFilter()
{
  var period = 5;
  var time   = elapsedTime % period;

  background(0);


  // print out time info:
  var xKey   = 10;
  var xValue = 90;
  var y      = 20;
  var dy     = 16;
  fill("white");

  text("Elapsed Time:",        xKey,   y);
  text(elapsedTime.toFixed(1), xValue, y);
  y += dy;
  text("Time Delta:",        xKey,   y);
  text(timeDelta.toFixed(3), xValue, y);
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
  // update global time variables
  var fr = frameRate();
  if(fr > 0)
    timeDelta = 1/fr;
  else
    timeDelta = 0;
  elapsedTime += timeDelta;  


  rsTestExpDecayFilter();



}