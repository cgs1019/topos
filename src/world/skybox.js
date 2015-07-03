goog.provide('topos.world.Skybox');
goog.require('topos.gl.Mesh');

goog.scope(function() {

var world = topos.world;

world.Skybox = function(sky_texture, transformation_matrix) {
  this.texture = sky_texture;
  this.transformation_matrix = transformation_matrix;

  var size = 5000;
  this.vertices = [
      // Front face
      -size, -size,  size,
       size, -size,  size,
       size,  size,  size,
      -size,  size,  size,

      // Back face
      -size, -size, -size,
      -size,  size, -size,
       size,  size, -size,
       size, -size, -size,

      // Top face
      -size,  size, -size,
      -size,  size,  size,
       size,  size,  size,
       size,  size, -size,

      // Bottom face
      -size, -size, -size,
       size, -size, -size,
       size, -size,  size,
      -size, -size,  size,

      // Right face
       size, -size, -size,
       size,  size, -size,
       size,  size,  size,
       size, -size,  size,

      // Left face
      -size, -size, -size,
      -size, -size,  size,
      -size,  size,  size,
      -size,  size, -size];

  this.triangles = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
  ];

  this.texture_coords = [
      // Front face
      0, 0,
      1, 0,
      1, 1,
      0, 1,

      // Back face
      1, 0,
      1, 1,
      0, 1,
      0, 0,

      // Top face
      0, 1,
      0, 0,
      1, 0,
      1, 1,

      // Bottom face
      1, 1,
      0, 1,
      0, 0,
      1, 0,

      // Right face
      1, 0,
      1, 1,
      0, 1,
      0, 0,

      // Left face
      0, 0,
      1, 0,
      1, 1,
      0, 1
  ];
}

world.Skybox.prototype.CreateMesh = function(gl) {
  return new topos.gl.Mesh(
    gl,
    this.vertices,
    this.triangles,
    this.texture_coords,
    this.texture,
    this.transformation_matrix,
    null  /* normals */);
}

});  // goog.scope
