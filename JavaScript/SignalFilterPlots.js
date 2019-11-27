let plotExpDecImpResp = function(p) {
  let x = 100;
  let y = 100;

  p.setup = function() {
    p.createCanvas(700, 410);
  };

  p.draw = function() {
    p.background(0);
    p.fill(255);
    p.rect(x, y, 50, 50);
  };
};

let myp5 = new p5(plotExpDecImpResp);


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