// move to library rsCore.js
function rsAssert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

//-------------------------------------------------------------------------------------------------
// move into a library rsPlotting.js or rsPlotViaGrafica:

function rsPlotPoints(p, points, width=600, height=300)
{
  var margin = 0; 
  var dimCorrection = -100;
  // Hack: for some weird reason, the setDim function of GPlot makes the plots 100 pixels too 
  // wide and high, so we need this correction -> figure out, what's wrong with grafica here



  // Create a new plot and set its position on the screen
  var plot = new GPlot(p);
  plot.setPos(margin, margin);  // top-left corner
  plot.setDim([width - 2*margin + dimCorrection, height - 2*margin + dimCorrection]); 

  // Set the plot title and the axis labels:
  plot.setPoints(points);
  plot.getXAxis().setAxisLabelText("x axis");
  plot.getYAxis().setAxisLabelText("y axis");
  plot.setTitleText("A very simple example");

  // Draw it:
  plot.defaultDraw();

}
// todo: figure out, how to control the colors of background, axes, graph, etc. - maybe implement
// convenience setup funtions that realize different color-schemes - like dark-on-bright (suitable 
// for print) or bright-on-dark (suitable for screen)
// also figure out, hwo to control axis ticks etc.

function rsPlotXY(p, x, y, width=600, height=300)
{
  rsAssert(x.length == y.length)
  var points = [];
  for (var i = 0; i < x.length; i++)
    points[i] = new GPoint(x[i], y[i]);
  rsPlotPoints(p, points, width, height);
}
// what sort of object is p? figure out choose an appropriate name - do we need it? 
// in the html-document, we call:
// let plot1 = new p5(examplePlot);
// is p some p5 object? apparently, as we call p5 functions like createCanvas on it? so how does 
// this work? the new p5 object calls a user-supplied function like our examplePlot, passing 
// itself als argument? -> look up documentation
// we may have to pass this "p" object as additional parameter into our plotting functions
// how can we make plotting functions that don't need a "p"?

//-------------------------------------------------------------------------------------------------
// move into a library rsCurves.js

function rsGetSinePoints(numPoints)
{
  var points = [];
  for (var i = 0; i < numPoints; i++)
  {
    var x = 2*Math.PI*i/(numPoints-1);
    var y = Math.sin(x);
    points[i] = new GPoint(x, y);
  }
  return points;
}
// Creates an array of points containing one cycle of the sine function
// this is mostly for testing purposes - maybe make more functions like that that generate points
// for various curves: getLissajousPoints(numPoints, numLobesX, numLobesY), getLemniscatePoints, 
// getAstroidePoints - make a library: rsCurves

//-------------------------------------------------------------------------------------------------

// move to ExamplePlots:
let rsPlotSine = function(p) {

  p.setup = function () {
    width  = 600;
    height = 300;
    var canvas = p.createCanvas(width, height);
    p.background(150); // maybe use black later
    rsPlotPoints(p, rsGetSinePoints(100), width, height);
    p.noLoop();
  };

  /*
  p.draw = function() {
    p.background(0);
    p.fill(255);
    p.rect(x, y, 50, 50);
  };
  */
  // i think, the p.draw function is only needed when we want to periodically redraw the image, 
  // i.e. create an animation - and it's probably mutually exclusive with calling noLoop?
  // try making an animated plot - maybe draw an animated lissajous figure
};
// it seems, when calling createCanvas multiple times, the canvases are always placed next to 
// each other and wrapping them into a table doesn't seem to have any effect - it seems, they are
// not wrapped at all and instead appear next to the table - maybe create canvas always put the
// canvas(es) into the the top-level html-element - if not told otherwise? maybe we can pass the 
// containign element -> check docs

let rsExpDecayImpResp = function(p) 
{

  p.setup = function () {

    var width  = 600;
    var height = 300;
    var canvas = p.createCanvas(width, height);
    p.background(150); // maybe use black later

    // create data to plot:
    var frameRate = 60;
    var dt = 1/frameRate;
    var numPoints = 50;
    var randomness = 0.8*dt;
    var filter = new ExpDecayFilter(0.2);
    var x = [];
    var y = [];
    var t = 0;
    x[0] = 0;
    y[0] = filter.getSample(1, dt);
    for(i = 1; i < numPoints; i++)
    {
      dt_i = dt + randomness*Math.random();
      x[i] = x[i-1] + dt_i;
      y[i] = filter.getSample(0, dt_i);
    }
    // todo: add random variation to the time-instants: dt_i = dt + rand(...)
    // x[i] = x[i-1] + dt_i
    // y[i] = filter.getSample(0, dt_i);


    rsPlotXY(p, x, y, width, height);
    p.noLoop();
  };
}




// see here:
// https://github.com/processing/p5.js/wiki/p5.js-overview#instantiation--namespace







// see:
// https://p5js.org/examples/instance-mode-instantiation.html

// later, we want to have several plots on one html page - figure out, how to schieve that