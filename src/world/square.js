goog.provide('topos.world.Square');
goog.require('topos.gl.Mesh');
goog.require('topos.math.LinearAlgebra.SquareMatrix');

goog.scope(function() {

var world = topos.world;
var la = topos.math.LinearAlgebra;

world.Square = function(texture, size, transformation_matrix) {
  this.texture = texture;
  this.transformation_matrix = transformation_matrix;
  this.animate = false;

  this.vertices = [
      // Front face
      -size, 0,  size,
       size, 0,  size,
       size, 0, -size,

      -size, 0,  size,
       size, 0, -size,
      -size, 0, -size
  ];

  this.texture_coords = [
      // Front face
      0, 0,  1, 0,  1, 1,
      0, 0,  1, 1,  0, 1
  ];

  this.normals = null;
}

world.Square.prototype.CreateMesh = function(gl) {
  return new topos.gl.Mesh(
    gl,
    this.vertices,
    this.texture_coords,
    this.texture,
    this.transformation_matrix,
    this.normals);
}

world.Square.prototype.Animate = function(dt) {
  this.transformation_matrix.Multiply(
      la.SquareMatrix.MakeTransform(0, 0, 0, Math.PI * dt));
}

});  // goog.scope
