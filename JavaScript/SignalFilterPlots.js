let plotExpDecImpResp = function(p) {
  let x = 100;
  let y = 100;

  p.setup = function() {

		// Create the canvas
		var canvas = p.createCanvas(450, 350);
		p.background(150);

		// Prepare the points for the plot
		var points = [];
		var seed = 100 * p.random();

		for (var i = 0; i < 100; i++) {
			points[i] = new GPoint(i, 10 * p.noise(0.1 * i + seed));
		}

		// Create a new plot and set its position on the screen
		var plot = new GPlot(p);
    plot.setPos(10, 10);      // top-left corner
    plot.setDim([250, 150]);  // width, height

    // Set the plot title and the axis labels
		plot.setPoints(points);
		plot.getXAxis().setAxisLabelText("x axis");
		plot.getYAxis().setAxisLabelText("y axis");
		plot.setTitleText("A very simple example");

		// Draw it!
		plot.defaultDraw();
		p.noLoop();
  };

  /*
  p.draw = function() {
    p.background(0);
    p.fill(255);
    p.rect(x, y, 50, 50);
  };
  */
};

// it seems, when calling createCanvas multiple times, the canvases are alway paced next tp each other
// an wrapping them into a table doesn't seem to have any effect - it seems, they are not wrapped at 
// all and instead appear next to the table

//let myp5 = new p5(plotExpDecImpResp);


/*
function plotExpDecImpResp(p)
{
  var canvas = p.createCanvas(500, 350);
  p.background(150);
}
*/


/*
function plot()   // rename to plotExpDecImpResp
{
  p = new p5(plotExpDecImpResp, "ExpDecImpResp");
}
*/

// see:
// https://p5js.org/examples/instance-mode-instantiation.html

// later, we want to have several plots on one html page - figure out, how to schieve that