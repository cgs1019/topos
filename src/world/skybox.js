goog.provide('topos.world.Skybox');
goog.require('topos.gl.Mesh');

goog.scope(function() {

var world = topos.world;

world.Skybox = function(sky_texture) {
  this.texture = sky_texture;

  var size = 20000;
  this.vertices = [
      // Front face
      -size, -size,  size,
       size, -size,  size,
       size,  size,  size,

      -size, -size,  size,
       size,  size,  size,
      -size,  size,  size,

      // Back face
      -size, -size, -size,
      -size,  size, -size,
       size,  size, -size,

      -size, -size, -size,
       size,  size, -size,
       size, -size, -size,

      // Top face
      -size,  size, -size,
      -size,  size,  size,
       size,  size,  size,

      -size,  size, -size,
       size,  size,  size,
       size,  size, -size,

      // Bottom face
      -size, -size, -size,
       size, -size, -size,
       size, -size,  size,

      -size, -size, -size,
       size, -size,  size,
      -size, -size,  size,

      // Right face
       size, -size, -size,
       size,  size, -size,
       size,  size,  size,

       size, -size, -size,
       size,  size,  size,
       size, -size,  size,

      // Left face
      -size, -size, -size,
      -size, -size,  size,
      -size,  size,  size,

      -size, -size, -size,
      -size,  size,  size,
      -size,  size, -size];

  this.texture_coords = [
      // Front face
      0, 0,
      1, 0,
      1, 1,

      0, 0,
      1, 1,
      0, 1,

      // Back face
      1, 0,
      1, 1,
      0, 1,

      1, 0,
      0, 1,
      0, 0,

      // Top face
      0, 1,
      0, 0,
      1, 0,

      0, 1,
      1, 0,
      1, 1,

      // Bottom face
      1, 1,
      0, 1,
      0, 0,

      1, 1,
      0, 0,
      1, 0,

      // Right face
      1, 0,
      1, 1,
      0, 1,

      1, 0,
      0, 1,
      0, 0,

      // Left face
      0, 0,
      1, 0,
      1, 1,

      0, 0,
      1, 1,
      0, 1
  ];
}

world.Skybox.prototype.CreateMesh = function(gl) {
  return new topos.gl.Mesh(
    gl,
    this.vertices,
    this.texture_coords,
    this.texture,
    null,
    null  /* normals */);
}

});  // goog.scope
