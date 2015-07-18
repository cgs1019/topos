goog.provide('topos.gl.util.GlUtil');
goog.require('topos.math.LinearAlgebra.SquareMatrix');

goog.scope(function() {

var gl_util = topos.gl.util;
var la = topos.math.LinearAlgebra;

gl_util.GlUtil = function(canvas, perspective_matrix) {
  this.perspective_matrix = perspective_matrix;
  this.canvas = canvas;
  this.ctx = canvas.getContext("experimental-webgl") ||
      canvas.getContext("webgl");
}

gl_util.GlUtil.prototype.Initialize = function() {
  this.shader_vars = this.InitShaders();

  this.ctx.clearColor(.47, .71, .99, 1.0);
  this.ctx.enable(this.ctx.DEPTH_TEST);
  this.ctx.depthFunc(this.ctx.LESS);
  this.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);

  this.ctx.uniformMatrix4fv(
      this.shader_vars.perspective_matrix,
      false,
      this.perspective_matrix.AsFloat32Array());

  // resize the canvas to fill browser window dynamically
  var self = this;
  window.addEventListener(
      'resize',
      function() {
        self.ResizeCanvas();
      },
      false);
  this.ResizeCanvas();
}

gl_util.GlUtil.prototype.EnableBlending = function() {
  this.ctx.enable(this.ctx.BLEND);
  this.ctx.disable(this.ctx.DEPTH_TEST);
  this.ctx.blendFunc(this.ctx.SRC_ALPHA, this.ctx.ONE_MINUS_SRC_ALPHA);
}

gl_util.GlUtil.prototype.DisableBlending = function() {
  this.ctx.disable(this.ctx.BLEND);
  this.ctx.enable(this.ctx.DEPTH_TEST);
}

gl_util.GlUtil.prototype.LoadScriptText = function(script_name) {
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

gl_util.GlUtil.prototype.GetShader = function(shader_type, script_name) {
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

gl_util.GlUtil.prototype.InitShaders = function() {
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
  if (!this.ctx.getProgramParameter(shader_program, this.ctx.LINK_STATUS)) {
    throw "Failed to link program";
  }

  this.ctx.useProgram(shader_program);

  var shader_vars_info = [
      {name: "vertex_coord", type: "attribute"},
      {name: "texture_coord", type: "attribute"},
      {name: "normal", type: "attribute"},
      {name: "transformation_matrix", type: "uniform"},
      {name: "position_matrix", type: "uniform"},
      {name: "perspective_matrix", type: "uniform"},
      {name: "u_sampler", type: "uniform"},
      {name: "use_lighting", type: "uniform"},
      {name: "directional_light", type: "uniform"}
  ];

  var shader_vars = {};
  for (var i in shader_vars_info) {
    var info = shader_vars_info[i];
    if (info.type == "attribute") {
      shader_vars[info.name] = 
          this.ctx.getAttribLocation(shader_program, info.name);
    } else if (info.type == "uniform") {
      shader_vars[info.name] = 
          this.ctx.getUniformLocation(shader_program, info.name);
    } else {
      throw "Unrecognized shader var type: " + info.type;
    }
  }

  console.log("Shader vars info:")
  for (var i in shader_vars_info) {
    var info = shader_vars_info[i]
    console.log(info.type + " " +
                shader_vars[info.name] + ": " +
                info.name);
  }

  return shader_vars;
}

gl_util.GlUtil.prototype.SetPositionMatrix = function(position_matrix) {
  this.ctx.uniformMatrix4fv(
      this.shader_vars.position_matrix,
      false,
      position_matrix.AsFloat32Array());
}

gl_util.GlUtil.prototype.SetDirectionalLight = function(light_direction) {
  this.ctx.uniform3fv(
      this.shader_vars.directional_light,
      new Float32Array(light_direction.data));
}

gl_util.GlUtil.prototype.DrawMesh = function(mesh) {
  this.ctx.activeTexture(this.ctx.TEXTURE0);
  this.ctx.bindTexture(this.ctx.TEXTURE_2D, mesh.texture);
  this.ctx.uniform1i(this.shader_vars.u_sampler, 0);

  var transformation_matrix =
      mesh.transformation_matrix || la.SquareMatrix.MakeTransform(0, 0, 0, 0);
  this.ctx.uniformMatrix4fv(
      this.shader_vars.transformation_matrix,
      false,
      transformation_matrix.AsFloat32Array());

  this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, mesh.vert_buffer);
  this.ctx.vertexAttribPointer(
      this.shader_vars.vertex_coord, 3, this.ctx.FLOAT, false, 0, 0);

  this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, mesh.texture_coords_buffer);
  this.ctx.vertexAttribPointer(
      this.shader_vars.texture_coord, 2, this.ctx.FLOAT, false, 0, 0);

  this.ctx.uniform1i(
      this.shader_vars.use_lighting,
      mesh.normals_buffer != null);

  if (mesh.normals_buffer != null) {
    this.ctx.bindBuffer(this.ctx.ARRAY_BUFFER, mesh.normals_buffer);
    this.ctx.vertexAttribPointer(
        this.shader_vars.normal, 3, this.ctx.FLOAT, false, 0, 0);
  }

  this.ctx.drawArrays(
      this.ctx.TRIANGLES,
      0,
      mesh.num_vertices);
}

gl_util.GlUtil.prototype.ResizeCanvas = function() {
  if (this.aspect * window.innerHeight < window.innerWidth) {
    this.canvas.width = this.aspect * window.innerHeight;
    this.canvas.height = window.innerHeight;
  } else {
    this.canvas.width =  window.innerWidth;
    this.canvas.height = window.innerWidth / this.aspect;
  }
  this.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
}

});
