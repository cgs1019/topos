goog.provide('topos.gl.Mesh');

goog.scope(function() {

topos.gl.Mesh = function(
  gl, vertices, triangles, texture_coords, texture, transformation_matrix, normals) {
  this.texture = texture;
  this.transformation_matrix = transformation_matrix;
  this.vert_buffer = gl.ctx.createBuffer();
  gl.ctx.bindBuffer(gl.ctx.ARRAY_BUFFER, this.vert_buffer);
  gl.ctx.bufferData(
      gl.ctx.ARRAY_BUFFER,
      new Float32Array(vertices),
      gl.ctx.STATIC_DRAW);
  gl.ctx.bindBuffer(gl.ctx.ARRAY_BUFFER, null);

  this.num_triangles = triangles.length;
  this.triangle_buffer = gl.ctx.createBuffer();
  gl.ctx.bindBuffer(gl.ctx.ELEMENT_ARRAY_BUFFER, this.triangle_buffer);
  gl.ctx.bufferData(
      gl.ctx.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(triangles),
      gl.ctx.STATIC_DRAW);
  gl.ctx.bindBuffer(gl.ctx.ELEMENT_ARRAY_BUFFER, null);

  this.texture_coords_buffer = gl.ctx.createBuffer();
  gl.ctx.bindBuffer(gl.ctx.ARRAY_BUFFER, this.texture_coords_buffer);
  gl.ctx.bufferData(
      gl.ctx.ARRAY_BUFFER,
      new Float32Array(texture_coords),
      gl.ctx.STATIC_DRAW);
  console.log(this.texture_coords_buffer);
  gl.ctx.bindBuffer(gl.ctx.ARRAY_BUFFER, null);

  if (normals != null) {
    this.normals_buffer = gl.ctx.createBuffer();
    gl.ctx.bindBuffer(gl.ctx.ARRAY_BUFFER, this.normals_buffer);
    gl.ctx.bufferData(
        gl.ctx.ARRAY_BUFFER,
        new Float32Array(normals),
        gl.ctx.STATIC_DRAW);
    console.log(normals);
    console.log(this.normals_buffer);
    gl.ctx.bindBuffer(gl.ctx.ARRAY_BUFFER, null);
  } else {
    this.normals_buffer = null;
  }
}

});  // goog.scope
