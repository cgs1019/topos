goog.provide('topos.math.Lindstrom');
goog.require('topos.math.QuadTree');
goog.require('topos.math.Util');
goog.require('topos.math.LinearAlgebra.SquareMatrix');
goog.require('topos.math.LinearAlgebra.Vector');

goog.scope(function() {

var la = topos.math.LinearAlgebra;
var math = topos.math;

math.Lindstrom = function(vertices, params) {
  if (!math.Util.CheckPowerOfTwo(vertices.length - 1)) {
    throw "Height map must be of size 2^k + 1";
  }
  if (vertices.length != vertices[0].length) {
    throw "Height map must be of equal width and depth. Instead it's" +
        vertices.length + " x " + vertices[0].length;
  }

  this.vertices = vertices;
  this.size = vertices.length;
  this.log_size = Math.log(vertices.length - 1) / Math.log(2);
  this.params = params;

  this.corners = [
    [0, 0], 
    [0, this.size - 1],
    [this.size - 1, this.size - 1],
    [this.size - 1, 0]
  ];


  this.quadtree = new math.QuadTree(
      this.log_size,
      null,  // parent
      { l: 0, r: this.size - 1, f: 0, b: this.size - 1 },
      this.vertices
  );
}

math.Lindstrom.prototype.GetVertexData = function(eye) {
  var vertex_data = {
    vertices: [],
    texture_coords: []
  };
  var eye = new la.Vector([0, 0, 0, 1])
  for (var i = 3; i >= 0; i--) {
    this.GetVertexDataRecursive(
        0,
        eye,
        [
          [(this.size - 1) / 2, (this.size - 1) / 2],
          this.corners[i],
          this.corners[(i + 1) % 4]
        ],
        vertex_data.vertices,
        vertex_data.texture_coords);
  }

  console.log("Lindstrom triangle count: " + (vertex_data.vertices.length / 9));
  return vertex_data;
}

math.Lindstrom.prototype.GetVertexDataRecursive =
    function(depth, eye, tri, vertices, texture_coords) {
  var mid_point = math.Util.GetMidPoint2d(tri[1], tri[2]);
  if (mid_point[0] % 1 == 0 && mid_point[1] % 1 == 0) {
    var mid_point_v = this.vertices[mid_point[1]][mid_point[0]];
    if (mid_point_v.enabled) {
      this.GetVertexDataRecursive(
          depth + 1, eye, [mid_point, tri[0], tri[1]], vertices, texture_coords);
      this.GetVertexDataRecursive(
          depth + 1, eye, [mid_point, tri[2], tri[0]], vertices, texture_coords);
      return
    }
  }
  this.PushTriangle(tri, this.vertices, vertices, texture_coords);
}

math.Lindstrom.prototype.PushTriangle = function(
    tri, source_vertices, vertices, texture_coords) {
  var v = source_vertices[tri[0][0]][tri[0][1]];
  vertices.push(v.coords[0]);
  vertices.push(v.coords[1]);
  vertices.push(v.coords[2]);

  v = source_vertices[tri[1][0]][tri[1][1]];
  vertices.push(v.coords[0]);
  vertices.push(v.coords[1]);
  vertices.push(v.coords[2]);

  v = source_vertices[tri[2][0]][tri[2][1]];
  vertices.push(v.coords[0]);
  vertices.push(v.coords[1]);
  vertices.push(v.coords[2]);

  texture_coords.push(0, 0, 0, 1, 1, 1);
  //texture_coords.push(
  //    tri[0][0], tri[0][1],
  //    tri[1][0], tri[1][1],
  //    tri[2][0], tri[2][1]);
}

math.Lindstrom.GenerateTestHeightMap = function(size, extent) {
  var height_map = [];
  for (var z = 0; z < size; z++) {
    var row = [];
    for (var x = 0; x < size; x++) {
      if (x < (size + 1) / 2) {
        row.push(0);
      } else {
        var height =
            (extent) * Math.sqrt(2) * (1 + x - (size + 1) / 2) / (size + 1) ;
        row.push(height)
      }
    }
    height_map.push(row);
  }
  return height_map;
}

});  // goog.scope

