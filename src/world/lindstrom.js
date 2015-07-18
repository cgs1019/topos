goog.provide('topos.world.Lindstrom');
goog.require('topos.gl.Mesh');
goog.require('topos.math.Util');
goog.require('topos.math.LinearAlgebra.SquareMatrix');
goog.require('topos.math.LinearAlgebra.Vector');

goog.scope(function() {

var la = topos.math.LinearAlgebra;
var math = topos.math;
var world = topos.world;

world.Lindstrom =
    function(height_map, extent, texture, params) {
  if (!math.Util.CheckPowerOfTwo(height_map.length - 1)) {
    throw "Height map must be of size 2^k + 1";
  }
  if (height_map.length != height_map[0].length) {
    throw "Height map must be of equal width and depth. Instead it's" +
        height_map.length + " x " + height_map[0].length;
  }
  this.height_map = height_map;
  this.size = height_map.length;
  this.log_size = Math.log(height_map.length - 1) / Math.log(2);
  this.extent = extent;
  this.texture = texture;
  this.params = params;
  this.transformation_matrix =
      la.SquareMatrix.MakeTransform(0, 0, 0, 0);

  this.corners = [
    [0, 0], 
    [this.size - 1, 0],
    [this.size - 1, this.size - 1],
    [0, this.size - 1]
  ];

  this.vertices = world.Lindstrom.GenerateVerts(height_map, extent);

  this.quadtree = new world.Lindstrom.QuadTree(
      this.log_size,
      null,  // parent
      { l: 0, r: height_map.length - 1, f: 0, b: height_map.length - 1 },
      this.vertices
  );

  console.log(this.quadtree);
}

world.Lindstrom.GenerateVerts = function(height_map, extent) {
  var depth = height_map.length;
  var width = height_map[0].length;
  var vertices = [];

  for (var z = 0; z < depth; z++) {
    var row = [];
    for (var x = 0; x < width; x++) {
      row.push({
        active: true,
        enabled: (Math.random() > .2),
        coords: [
          (2 * x - width) * extent / width,
          height_map[x][z],
          (2 * z - depth) * extent / depth
        ]});
    }
    vertices.push(row);
  }

  return vertices;
}

world.Lindstrom.prototype.CreateMesh = function(gl) {
  var vertex_data = this.GetVertexData();
  console.log("Lindstrom triangle count: " +
      (vertex_data.vertices.length / 9));

  return new topos.gl.Mesh(
    gl,
    vertex_data.vertices,
    vertex_data.texture_coords,
    this.texture,
    this.transformation_matrix,
    null);
}

world.Lindstrom.prototype.GetVertexData =
    function() {
  var vertices = [];
  var texture_coords = [];

  var stack = [];
  for (var i = 3; i >= 0; i--) {
    stack.push([
      [(this.size - 1) / 2, (this.size - 1) / 2],
      this.corners[i],
      this.corners[(i + 1) % 4]
    ]);
  }

  while (stack.length > 0) {
    var tri = stack.pop();
    var mid_point = math.Util.GetMidPoint2d(tri[1], tri[2]);
    if (mid_point[0] % 1 == 0 && mid_point[1] % 1 == 0) {
      var mid_point_v = this.vertices[mid_point[0]][mid_point[1]];
      if (mid_point_v.enabled) {
        stack.push([mid_point, tri[0], tri[1]]);
        stack.push([mid_point, tri[2], tri[0]]);
        continue;
      }
    }
    this.PushTriangle(tri, this.vertices, vertices, texture_coords);
  }

  return {
    vertices: vertices,
    texture_coords: texture_coords
  };
}

world.Lindstrom.prototype.PushTriangle = function(
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

world.Lindstrom.GenerateTestHeightMap = function(size) {
  var height_map = [];
  for (var z = 0; z < size; z++) {
    var row = [];
    for (var x = 0; x < size; x++) {
      if (x < (size + 1) / 2) {
        row.push(0);
      } else {
        var height = 
            (size / 2) * Math.sqrt(2) * (1 + x - (size + 1) / 2) / (size + 1) ;
        row.push(height)
      }
    }
    height_map.push(row);
  }
  return height_map;
}

world.Lindstrom.QuadTree = function(depth, parent, range, vertices) {
  this.parent = parent;
  this.range = range;
  this.active = true;
  this.visible = true;
  this.children = null;

  if (depth > 0) {
    this.active = false;
    this.children = [];
    // Generate children in counterclockwise order from bottom-left:
    // [sw, se, ne, nw]
    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 2; j++) {
        this.children.push(
            new world.Lindstrom.QuadTree(
              depth - 1,
              this,
              {
                l: range.l + ((i + j) % 2 + 0) * (range.r - range.l) / 2,
                r: range.l + ((i + j) % 2 + 1) * (range.r - range.l) / 2,
                f: range.f + (i + 0) * (range.b - range.f) / 2,
                b: range.f + (i + 1) * (range.b - range.f) / 2
              },
              vertices));
      }
    }
    this.bounding_box = math.Util.CombineBoundingBoxes(
        this.children[0].bounding_box,
        this.children[1].bounding_box,
        this.children[2].bounding_box,
        this.children[3].bounding_box);
  } else {
    this.bounding_box = math.Util.ComputeBoundingBox(
            vertices[range.l][range.f],
            vertices[range.r][range.f],
            vertices[range.l][range.b],
            vertices[range.r][range.b]);
  }
}

});  // goog.scope
