goog.provide('topos.world.Drawable');

goog.scope(function() {

var world = topos.world;

world.Drawable = function(buffer) {
  this.buffer = buffer;
}

world.Drawable.Builder = function() { }

world.Drawable.Builder.prototype.WithVertices = function(vertices) {
  this.vertices = vertices;
}

world.Drawable.Builder.prototype.WithColors = function(colors) {
  this.colors = colors;
}

world.Drawable.Builder.prototype.WithTextureCoords = function(texture_coords) {
  this.texture_coords = texture_coords;
}

world.Drawable.Builder.prototype.WithNormals = function(normals) {
  this.normals = normals;
}

world.Drawable.Builder.prototype.WithBufferObjectHint = function(hint) {
  this.buffer_object_hint = hint;
}

world.Drawable.Builder.prototype.Build = function() {
}

world.Drawable.prototype.Draw = function(gl_ctx) {
  gl_ctx.activeTexture(gl_ctx.TEXTURE0);
  gl_ctx.bindTexture(gl_ctx.TEXTURE_2D, mesh.texture);
  gl_ctx.uniform1i(this.shader_vars.u_sampler, 0);

  gl_ctx.uniformMatrix4fv(
      this.shader_vars.transformation_matrix,
      false,
      mesh.transformation_matrix.AsFloat32Array());

  gl_ctx.bindBuffer(gl_ctx.ARRAY_BUFFER, mesh.vert_buffer);
  gl_ctx.vertexAttribPointer(
      this.shader_vars.vertex_coord, 3, gl_ctx.FLOAT, false, 0, 0);

  gl_ctx.bindBuffer(gl_ctx.ARRAY_BUFFER, mesh.texture_coords_buffer);
  gl_ctx.vertexAttribPointer(
      this.shader_vars.texture_coord, 2, gl_ctx.FLOAT, false, 0, 0);

  gl_ctx.uniform1i(this.shader_vars.use_lighting,
                     mesh.normals_buffer != null);
  if (mesh.normals_buffer != null) {
    gl_ctx.bindBuffer(gl_ctx.ARRAY_BUFFER, mesh.normals_buffer);
    gl_ctx.vertexAttribPointer(
        this.shader_vars.normal, 3, gl_ctx.FLOAT, false, 0, 0);
  }

  gl_ctx.drawArrays(
      gl_ctx.TRIANGLES,
      0,
      mesh.num_vertices);
}

});  // goog.scope
