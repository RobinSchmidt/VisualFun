/** Functions for drawing stuff with p5.js

Dependencies:
-p5.js  */


/** Creates the array of vertices for a parametric curve (x,y) = f(t) in the interval t = a..b with
n sample points/vertices.
@param {function}  f - The function that takes the parameter t and returns a 2D point.
@param {number}    a - Start of the interval for t.
@param {number}    b - End of the interval for t.
@param {number}    n - Number of sample points.     */
function rsCurveVertices(f, a, b, n)
{
  return [...Array(n+1).keys()].map(k => f(a + (b-a) * k/n));
}
// actually, i think f could also return a 3D point
// ..hmm - actually, it produces n+1 vertices, if f is perdiodic with period b-a, the last one will
// be the same as the first and the curve will be closed
// move to a library rsCurves.js that defines various curves in 2D and 3D
// ...this function does not depend on p5.js


/** Draws a bunch of lines from an array of points/vertices. Note that with transparency, this will
look different from drawing the same array of vertices using 
beginShape();vertex();vertex()...,;endShape(); even with noFill because at the joints of the lines, 
pixels will be drawn twice. 
@param {Array} p - An array of points/vertices */
function rsLines(p)
{
  for(var i = 0; i < p.length-1; i++)
    line(p[i][0], p[i][1], p[i+1][0], p[i+1][1]);
}
// rename to rsDrawWithLines, make a funtion rsDrawPolyLine that is similar but uses beginShape(), 
// vertex(), ... etc.


function rsRays(p)
{
  for(var i = 0; i < p.length; i++)
    line(0, 0, p[i][0], p[i][1]);
}


/** Draws a parametric curve (x,y) = f(t) in the interval t = a..b with n sample points 
@param {function}  f - The function that takes the parameter t and returns a 2D point.
@param {number}    a - Start of the interval for t.
@param {number}    b - End of the interval for t.
@param {number}   [n=200] - Number of sample points.     */
function rsCurveWithLines(f, a, b, n = 200)
{
  rsLines(rsCurveVertices(f, a, b, n));
}
// renameTo rsDrawCurveWithLines

function rsCurveWithRays(f, a, b, n = 200)
{
  rsRays(rsCurveVertices(f, a, b, n));
}