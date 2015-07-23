goog.provide('topos.math.Util');
goog.require('topos.math.LinearAlgebra.Vector');

goog.scope(function() {

var math = topos.math;
var la = topos.math.LinearAlgebra;

math.Util.CheckPowerOfTwo = function(a) {
  if (a != a) {  // true for Nan
    return false;
  }
  if (a < 0) {
    return math.Util.CheckPowerOfTwo(-a);
  }
  if (a < 1) {
    return false;
  }
  if (a == 1) {
    return true;
  }
  return math.Util.CheckPowerOfTwo(a / 2);
}

math.Util.GetMidPoint2d = function(x1, x2) {
  return [
      x1[0] / 2 + x2[0] / 2,
      x1[1] / 2 + x2[1] / 2
  ];
}

math.Util.ComputeBoundingBox = function(v1, v2, v3, v4) {
  return [
      [
        Math.min(v1.coords[0], v2.coords[0], v3.coords[0], v4.coords[0]),
        Math.min(v1.coords[1], v2.coords[1], v3.coords[1], v4.coords[1]),
        Math.min(v1.coords[2], v2.coords[2], v3.coords[2], v4.coords[2])
      ],
      [
        Math.max(v1.coords[0], v2.coords[0], v3.coords[0], v4.coords[0]),
        Math.max(v1.coords[1], v2.coords[1], v3.coords[1], v4.coords[1]),
        Math.max(v1.coords[2], v2.coords[2], v3.coords[2], v4.coords[2])
      ]
  ];
}

math.Util.CombineBoundingBoxes = function(b1, b2, b3, b4) {
  return [
      // bottom-left-front
      // smallest x, y, and z
      [
        Math.min(b1[0][0], b2[0][0], b3[0][0], b4[0][0]),
        Math.min(b1[0][1], b2[0][1], b3[0][1], b4[0][1]),
        Math.min(b1[0][2], b2[0][2], b3[0][2], b4[0][2])
      ],
      // top-back-right
      [
        Math.max(b1[1][0], b2[1][0], b3[1][0], b4[1][0]),
        Math.max(b1[1][1], b2[1][1], b3[1][1], b4[1][1]),
        Math.max(b1[1][2], b2[1][2], b3[1][2], b4[1][2])
      ]
  ];
}

math.Util.ComputeProjectedError = function(
    eye, triangle, mid_point, vertices) {
  var v1y = vertices[triangle[1][0]][triangle[1][1]].coords[1];
  var v2y = vertices[triangle[2][0]][triangle[2][1]].coords[1];

  var hpy = .5 * (v1y + v2y)
  var mpv = new la.Vector(vertices[mid_point[0]][mid_point[1]].coords.slice());
  mpv.size = 4;
  mpv.data.push(1.0);

  var delta = Math.abs(mpv.data[1] - hpy);

  var dv = eye.Difference(mpv);

  var dx2 = dv.data[0] * dv.data[0];
  var dy2 = dv.data[1] * dv.data[1];
  var dz2 = dv.data[2] * dv.data[2];

  var delta_screen =
      Math.sqrt(delta * delta * (dx2 + dy2) / Math.pow(dx2 + dy2 + dz2, 2));

  console.log(triangle[0], triangle[1], triangle[2], mid_point);
  console.log(1300 * delta_screen);
  return delta_screen;
}

});
