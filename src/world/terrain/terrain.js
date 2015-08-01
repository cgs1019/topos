goog.provide('topos.world.terrain.Terrain');
goog.require('topos.gl.GlUtil');
goog.require('topos.math.Lindstrom');
goog.require('topos.math.LinearAlgebra.SquareMatrix');
goog.require('topos.math.Util');

goog.scope(function() {

var gl = topos.gl;
var la = topos.math.LinearAlgebra;
var math = topos.math;
var terrain = topos.world.terrain;

terrain.Terrain = function(
    ctx, height_map, extent, texture, position_matrix, perspective_matrix) {
  if (!math.Util.CheckPowerOfTwo(height_map.length - 1)) {
    throw "Height map must be of size 2^k + 1";
  }
  if (height_map.length != height_map[0].length) {
    throw "Height map must be of equal width and depth. Instead it's" +
        height_map.length + " x " + height_map[0].length;
  }

  this.ctx = ctx;
  this.texture = texture;
  this.position_matrix = position_matrix;
  this.perspective_matrix = perspective_matrix;
  this.transformation_matrix = la.SquareMatrix.MakeTransform(0, 0, 0, 0);

  this.vertices = terrain.Terrain.GenerateVerts(height_map, extent);

  this.lindstrom = new math.Lindstrom(this.vertices, {});

  this.shader_program = gl.GlUtil.LoadShaderProgram(
      this.ctx,
      "src/world/terrain/vs.glsl",
      "src/world/terrain/fs.glsl");

  this.ctx.useProgram(this.shader_program);

  this.shader_vars_info = [
      {name: "vertex_coord", type: "attribute"},
      {name: "texture_coord", type: "attribute"},
      {name: "transformation_matrix", type: "uniform"},
      {name: "position_matrix", type: "uniform"},
      {name: "perspective_matrix", type: "uniform"},
      {name: "u_sampler", type: "uniform"}
  ];

  this.shader_vars = gl.GlUtil.GetShaderVars(
      this.ctx, this.shader_program, this.shader_vars_info);
}

terrain.Terrain.GenerateVerts = function(height_map, extent) {
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
          height_map[z][x],
          (2 * z - depth) * extent / depth
        ]});
    }
    vertices.push(row);
  }

  return vertices;
}

terrain.Terrain.prototype.Draw = function() {
  this.ctx.useProgram(this.shader_program);
  this.shader_vars = gl.GlUtil.GetShaderVars(
      this.ctx, this.shader_program, this.shader_vars_info);

  var eye = new la.Vector([0, 0, 0, 1])
      .MatrixMultiply(this.position_matrix.Transpose());
  var vertex_data = this.lindstrom.GetVertexData(eye);

  this.ctx.enableVertexAttribArray(this.shader_vars.vertex_coord);
  this.ctx.enableVertexAttribArray(this.shader_vars.texture_coord);

  var num_vertices = vertex_data.vertices.length / 3;
  var vert_buffer = this.ctx.createBuffer();
  var texture_coords_buffer = this.ctx.createBuffer();

  this.ctx.uniformMatrix4fv(
      this.shader_vars.position_matrix,
      false,
      this.position_matrix.AsFloat32Array());

  this.ctx.uniformMatrix4fv(
      this.shader_vars.perspective_matrix,
      false,
      this.perspective_matrix.AsFloat32Array());

  this.ctx.uniformMatrix4fv(
      this.shader_vars.transformation_matrix,
      false,
      this.transformation_matrix.AsFloat32Array());

  this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, vert_buffer);
  this.ctx.bufferData(
      this.ctx.ARRAY_BUFFER,
      new Float32Array(vertex_data.vertices),
      this.ctx.STATIC_DRAW);
  this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, null);

  this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, texture_coords_buffer);
  this.ctx.bufferData(
      this.ctx.ARRAY_BUFFER,
      new Float32Array(vertex_data.texture_coords),
      this.ctx.STATIC_DRAW);
  this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, null);

  this.ctx.activeTexture(this.ctx.TEXTURE0);
  this.ctx.bindTexture(this.ctx.TEXTURE_2D, this.texture);
  this.ctx.uniform1i(this.shader_vars.u_sampler, 0);

  this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, vert_buffer);
  this.ctx.vertexAttribPointer(
      this.shader_vars.vertex_coord, 3, this.ctx.FLOAT, false, 0, 0);

  this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, texture_coords_buffer);
  this.ctx.vertexAttribPointer(
      this.shader_vars.texture_coord, 2, this.ctx.FLOAT, false, 0, 0);

  this.ctx.drawArrays(this.ctx.TRIANGLES, 0, num_vertices);
}

});  // goog.scope
