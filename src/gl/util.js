goog.provide('topos.gl.util.GL');
goog.require('topos.math.LinearAlgebra.SquareMatrix');

goog.scope(function() {

var gl_util = topos.gl.util;
var la = topos.math.LinearAlgebra;

gl_util.GL = function(aspect, canvas) {
  this.aspect = aspect;
  this.canvas = canvas;
  this.ctx = canvas.getContext("experimental-webgl") ||
      canvas.getContext("webgl");
}

gl_util.GL.prototype.Initialize = function() {
  this.shader_vars = this.InitShaders();

  this.ctx.clearColor(0.0, 0.0, 0.0, 1.0);
  this.ctx.enable(this.ctx.DEPTH_TEST);
  this.ctx.depthFunc(this.ctx.LESS);
  this.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);

  var perspective_matrix =
      la.SquareMatrix.MakePerspective(45, this.aspect, 1, 10000);
  this.ctx.uniformMatrix4fv(
      this.shader_vars.perspective_matrix,
      false,
      perspective_matrix.AsFloat32Array());
}

gl_util.GL.prototype.LoadScriptText = function(script_name) {
  var source_text;

  $.ajax({
      url: script_name,
      success: function(result) {
        if (result.isOk == false) {
          alert("Error reading " + script_name + ": " + result.message);
          return;
        }
        source_text = result;
      },
      async: false
  });

  return source_text;
}

gl_util.GL.prototype.GetShader = function(shader_type, script_name) {
  var shader_source = this.LoadScriptText(script_name);
  var shader = this.ctx.createShader(shader_type);

  this.ctx.shaderSource(shader, shader_source);

  // Compile the shader program
  this.ctx.compileShader(shader);
  if (!this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS)) {
    // Something went wrong during compilation; get the error
    throw "Could not compile shader (" + script_name + "):" +
        this.ctx.getShaderInfoLog(shader);
  }

  return shader;
}

gl_util.GL.prototype.InitShaders = function() {
  var fragment_shader = this.GetShader(
      this.ctx.FRAGMENT_SHADER, "glsl/fragment-shader.glsl");
  var vertex_shader = this.GetShader(
      this.ctx.VERTEX_SHADER, "glsl/vertex-shader.glsl");

  // Create the shader program
  var shader_program = this.ctx.createProgram();
  this.ctx.attachShader(shader_program, vertex_shader);
  this.ctx.attachShader(shader_program, fragment_shader);
  this.ctx.linkProgram(shader_program);

  // If creating the shader program failed, alert
  this.ctx.getProgramParameter(shader_program, this.ctx.LINK_STATUS);

  this.ctx.useProgram(shader_program);

  var shader_vars = {
    vertex_coord: this.ctx.getAttribLocation(shader_program, "vertex_coord"),
    texture_coord: this.ctx.getAttribLocation(shader_program, "texture_coord"),
    transformation_matrix: this.ctx.getUniformLocation(
        shader_program, "transformation_matrix"),
    position_matrix: this.ctx.getUniformLocation(
        shader_program, "position_matrix"),
    perspective_matrix: this.ctx.getUniformLocation(
        shader_program, "perspective_matrix"),
    u_sampler: this.ctx.getUniformLocation(shader_program, "u_sampler"),
    use_lighting: this.ctx.getUniformLocation(shader_program, "use_lighting"),
    normal: this.ctx.getAttribLocation(shader_program, "normal"),
    directional_light: this.ctx.getUniformLocation(shader_program,
                                                   "directional_light")
  }

  this.ctx.enableVertexAttribArray(shader_vars.texture_coord);
  this.ctx.enableVertexAttribArray(shader_vars.vertex_coord);
  this.ctx.enableVertexAttribArray(shader_vars.normal);


  return shader_vars;
}

gl_util.GL.prototype.SetPositionMatrix = function(position_matrix) {
  this.ctx.uniformMatrix4fv(
      this.shader_vars.position_matrix,
      false,
      position_matrix.AsFloat32Array());
}

gl_util.GL.prototype.SetDirectionalLight = function(light_direction) {
  this.ctx.uniform3fv(
      this.shader_vars.directional_light,
      new Float32Array(light_direction.data));
}

gl_util.GL.prototype.DrawMesh = function(mesh) {
  this.ctx.activeTexture(this.ctx.TEXTURE0);
  this.ctx.bindTexture(this.ctx.TEXTURE_2D, mesh.texture);
  this.ctx.uniform1i(this.shader_vars.u_sampler, 0);

  this.ctx.uniformMatrix4fv(
      this.shader_vars.transformation_matrix,
      false,
      mesh.transformation_matrix.AsFloat32Array());

  this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, mesh.vert_buffer);
  this.ctx.vertexAttribPointer(
      this.shader_vars.vertex_coord, 3, this.ctx.FLOAT, false, 0, 0);

  this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, mesh.texture_coords_buffer);
  this.ctx.vertexAttribPointer(
      this.shader_vars.texture_coord, 2, this.ctx.FLOAT, false, 0, 0);

  this.ctx.bindBuffer(this.ctx.ELEMENT_ARRAY_BUFFER, mesh.triangle_buffer);

  this.ctx.uniform1i(this.shader_vars.use_lighting,
                     mesh.normals_buffer != null);
  if (mesh.normals_buffer != null) {
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, mesh.normals_buffer);
    this.ctx.vertexAttribPointer(
        this.shader_vars.normal, 3, this.ctx.FLOAT, false, 0, 0);
  }

  this.ctx.drawElements(
      this.ctx.TRIANGLES,
      mesh.num_triangles,
      this.ctx.UNSIGNED_SHORT,
      0);
}

});
