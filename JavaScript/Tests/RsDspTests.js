// Bugs:
// when a different tab is open and we switch back, the radius of the circle has grow large 
// - maybe the value returned by frameRate is different when the tab is inactive? maybe log
// the framerate to a file

//import "rsSignalFilters.js;"
// doesn'k work - i get the error: Cannot use import statement outside a module
// see
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
// so, for the time being, the js file will be loaded in the html file right befor this file

// global variables - maybe wrap into object rsTimeInfo:
rsFrameRate   = 0;
rsElapsedTime = 0;  // elapsed time (in seconds) since intialization
rsTimeDelta   = 0;

//--------------------------------------------------------------------------------------------------
// Library functions under construction (are moved to rs.dsp.js, when finished):

// todo plot impulse-response of expDecayFilter - which library can we use for plotting?
// 
// https://plot.ly/javascript/
// https://lisacharlotterost.de/2016/05/17/one-chart-code/
// https://en.wikipedia.org/wiki/Comparison_of_JavaScript_charting_libraries

// based on p5js
// https://github.com/jagracar/grafica.js

// also nice:
// https://bitcraftlab.github.io/p5.gui/
// https://bitcraftlab.github.io/p5.gui/examples/quicksettings-1/
// https://github.com/Dozed12/p5.voronoi

// i think, i should use grafica here
// make a html file for plotting the ExpDecayFilter impulse response...or maybe put several plots
// into one html file...maybe even with guis - call it SignalFilterPlots.html/js or maybe 
// SignalFilterTests


//--------------------------------------------------------------------------------------------------
// Test and experimentation functions:

rsTimeCounter = 0;
//flt = new ExpDecayFilter(0.5); // time-constant tau is 2.0 seconds (time constant) 
flt = new AttackDecayFilter(0.1, 0.5);
//  decay seems to be too slow - bug in the filter coefficient computation formula?

// maybe put to top

function rsTestExpDecayFilter()
{
  var bpm = 100;

  //var period = 0.5;
  var period = 60 / bpm;

  var time   = rsElapsedTime % period;

  background(0);


  // Generate the peridic impulses (factor out into a class rsImpulseGenerator (but maybe make it 
  // better - spread impulses over two frames according to rsTimeDelat-period):
  var impulse = 0;
  rsTimeCounter += rsTimeDelta;
  if(rsTimeCounter >= period)
  {
    impulse = 1;
    impulse = 2;
    rsTimeCounter -= period;
  }

  // filter the impulse:
  var filteredImpulse = flt.getSample(impulse, rsTimeDelta);


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


  // draw a circle with radius proportional to filteredImpulse
  var s = filteredImpulse;
  fill(100*s, 50*s, 255*s); // brightness also depends on impulse
  translate(width/2, height/2);           // puts origin at the center of the canvas
  // maybe get rid of global transformations - draw directly in screen coordinates
  var scaleFactor = min(width,height);
  var diameter = 0.5;
  circle(0, 0, diameter * scaleFactor * filteredImpulse);

  // -use minSize + filteredImpulse * (maxSize - minSize)
  // -smooth the attack
  // -maybe make "a" unity in the filter, such that the circle does not get smaller when using 
  //  slower decay
  // -somehow, the size doesn't always be the same - oh - it seems, the filter must first warm up
  //  and build up some signal
  // -introduce user parameters to tweak, how much the impulse should affect size and brightness
  //  ...or maybe use a different filter for size and brightness (with different attack/decay 
  //  settings)
  // -maybe make not every beat equally important - i.e. use smaller impulses for the offbeats
  //  and maybe a larger impulse for the 1st of 4
}
// the goal is to get a nice pumping effect that can be used to modulate parameters with the beat 
// of the music - such as size, brightness, color, line-thickness, rotation, shear

// provide a gui to turn the blinking on/off - it's annoying
// maybe plot th e framerate at function of time




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