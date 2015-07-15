goog.provide('topos.gl.Mesh');

goog.scope(function() {

topos.gl.Mesh = function(
  gl, vertex_coords, texture_coords, texture, transformation_matrix, normals) {
  this.texture = texture;
  this.transformation_matrix = transformation_matrix;

  gl.ctx.enableVertexAttribArray(gl.shader_vars.vertex_coord);
  gl.ctx.enableVertexAttribArray(gl.shader_vars.texture_coord);

  this.num_vertices = vertex_coords.length / 3;
  this.vert_buffer = gl.ctx.createBuffer();
  gl.ctx.bindBuffer(gl.ctx.ARRAY_BUFFER, this.vert_buffer);
  gl.ctx.bufferData(
      gl.ctx.ARRAY_BUFFER,
      new Float32Array(vertex_coords),
      gl.ctx.STATIC_DRAW);
  gl.ctx.bindBuffer(gl.ctx.ARRAY_BUFFER, null);

  this.texture_coords_buffer = gl.ctx.createBuffer();
  gl.ctx.bindBuffer(gl.ctx.ARRAY_BUFFER, this.texture_coords_buffer);
  gl.ctx.bufferData(
      gl.ctx.ARRAY_BUFFER,
      new Float32Array(texture_coords),
      gl.ctx.STATIC_DRAW);
  gl.ctx.bindBuffer(gl.ctx.ARRAY_BUFFER, null);

  if (normals != null) {
    gl.ctx.enableVertexAttribArray(gl.shader_vars.normal);
    this.normals_buffer = gl.ctx.createBuffer();
    gl.ctx.bindBuffer(gl.ctx.ARRAY_BUFFER, this.normals_buffer);
    gl.ctx.bufferData(
        gl.ctx.ARRAY_BUFFER,
        new Float32Array(normals),
        gl.ctx.STATIC_DRAW);
    gl.ctx.bindBuffer(gl.ctx.ARRAY_BUFFER, null);
  } else {
    this.normals_buffer = null;
  }
}

});  // goog.scope
