goog.provide('topos.gl.GlUtil');

goog.scope(function() {

var gl = topos.gl;

gl.GlUtil.LoadShaderProgram = function(
    ctx,
    vertex_shader_file,
    fragment_shader_file) {
  var fragment_shader = gl.GlUtil.GetShader(
      ctx, ctx.FRAGMENT_SHADER, fragment_shader_file);
  var vertex_shader = gl.GlUtil.GetShader(
      ctx, ctx.VERTEX_SHADER, vertex_shader_file);

  // Create the shader program
  var shader_program = ctx.createProgram();
  ctx.attachShader(shader_program, vertex_shader);
  ctx.attachShader(shader_program, fragment_shader);
  ctx.linkProgram(shader_program);

  // If creating the shader program failed, alert
  if (!ctx.getProgramParameter(shader_program, ctx.LINK_STATUS)) {
    throw "Failed to link program";
  }

  return shader_program;
}

gl.GlUtil.LoadScriptText = function(script_name) {
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

gl.GlUtil.GetShader = function(ctx, shader_type, script_name) {
  var shader_source = this.LoadScriptText(script_name);
  var shader = ctx.createShader(shader_type);

  ctx.shaderSource(shader, shader_source);

  // Compile the shader program
  ctx.compileShader(shader);
  if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
    // Something went wrong during compilation; get the error
    throw "Could not compile shader (" + script_name + "):" +
        ctx.getShaderInfoLog(shader);
  }

  return shader;
}

gl.GlUtil.GetShaderVars = function(ctx, shader_program, shader_vars_info) {
  var shader_vars = {};
  for (var i in shader_vars_info) {
    var info = shader_vars_info[i];
    if (info.type == "attribute") {
      shader_vars[info.name] = 
          ctx.getAttribLocation(shader_program, info.name);
    } else if (info.type == "uniform") {
      shader_vars[info.name] = 
          ctx.getUniformLocation(shader_program, info.name);
    } else {
      throw "Unrecognized shader var type: " + info.type;
    }
  }
  return shader_vars;
}

});
