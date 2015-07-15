goog.provide('topos.world.Lindstrom');
goog.require('topos.gl.Mesh');
goog.require('topos.math.LinearAlgebra.SquareMatrix');
goog.require('topos.math.LinearAlgebra.Vector');

goog.scope(function() {

var world = topos.world;
var la = topos.math.LinearAlgebra;

world.Lindstrom =
    function(height_map, extent, texture, params) {
  this.height_map = height_map;
  this.extent = extent;
  this.texture = texture;
  this.params = params;
  this.transformation_matrix =
      la.SquareMatrix.MakeTransform(0, 0, 0, 0);

  var quadtree_depth = Math.log(height_map.length - 1) / Math.log(2);
  this.quadtree = new world.Lindstrom.QuadTree(
      quadtree_depth,
      null,  // parent
      { l: 0, r: height_map.length - 1, f: 0, b: height_map.length - 1 }
  );

  this.vertices = world.Lindstrom.GenerateVerts(height_map, extent);
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
        enabled: true,
        coords: [
          (2 * x - width) * extent / width,
          extent * height_map[x][z],
          (2 * z - depth) * extent / depth
        ]});
    }
    console.log(row);
    vertices.push(row);
  }

  return vertices;
}

world.Lindstrom.prototype.CreateMesh = function(gl) {
  return new topos.gl.Mesh(
    gl,
    this.vertices,
    this.texture_coords,
    this.texture,
    this.transformation_matrix,
    null);
}

world.Lindstrom.GenerateTestHeightMap = function(size) {
  var height_map = [];
  for (var z = 0; z < size; z++) {
    var row = [];
    for (var x = 0; x < size; x++) {
      if (x < (size + 1) / 2) {
        row.push(0);
      } else {
        var height = (1 + x - (size + 1) / 2) / ((size + 1) / Math.sqrt(2));
        row.push(height)
      }
    }
    height_map.push(row);
  }
  return height_map;
}

world.Lindstrom.QuadTree = function(depth, parent, range) {
  this.parent = parent;
  this.range = range;
  this.active = true;
  this.visible = true;
  this.children = null;
  if (depth > 0) {
    this.active = false;
    this.children = {
      sw: new world.Lindstrom.QuadTree(
          depth - 1,
          this,
          { l: range.l,
            r: range.l + (range.r - range.l) / 2,
            f: range.f,
            b: range.f + (range.b - range.f) / 2 }),
      se: new world.Lindstrom.QuadTree(
          depth - 1,
          this,
          { l: range.l + (range.r - range.l) / 2,
            r: range.r,
            f: range.f,
            b: range.f + (range.b - range.f) / 2 }),
      nw: new world.Lindstrom.QuadTree(
          depth - 1,
          this,
          { l: range.l,
            r: range.l + (range.r - range.l) / 2,
            f: range.f + (range.b - range.f) / 2,
            b: range.b }),
      ne: new world.Lindstrom.QuadTree(
          depth - 1,
          this,
          { l: range.l + (range.r - range.l) / 2,
            r: range.r,
            f: range.f + (range.b - range.f) / 2,
            b: range.b })
    };
  }
}

});  // goog.scope
