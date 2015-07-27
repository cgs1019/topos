goog.provide('topos.engine.Engine');
goog.require('topos.input.InputHandler');
goog.require('topos.math.LinearAlgebra.SquareMatrix');
goog.require('topos.math.LinearAlgebra.Vector');

goog.scope(function() {

var engine = topos.engine;
var input = topos.input;
var la = topos.math.LinearAlgebra;
var world = topos.world;

engine.Engine = function(canvas, aspect, initial_position, perspective_matrix, debug) {
  this.canvas = canvas;
  this.aspect = aspect;

  this.ctx = this.canvas.getContext("experimental-webgl") ||
      this.canvas.getContext("webgl");
  if (debug) {
    console.log("Using debug context");
    function logGLCall(functionName, args) {   
       console.log("gl." + functionName + "(" + 
          WebGLDebugUtils.glFunctionArgsToString(functionName, args) + ")");   
    } 
    this.ctx = WebGLDebugUtils.makeDebugContext(this.ctx, undefined, logGLCall);
  } else {
  }

  var light_direction = new la.Vector([-1, -1, 0]).Normalize();

  this.input_handler = new input.InputHandler(initial_position);
  this.scene = new world.Scene(this.ctx, initial_position, light_direction);

  // resize the canvas to fill browser window dynamically
  var self = this;
  window.addEventListener('resize', function() {self.ResizeCanvas();}, false);
  this.ResizeCanvas();
}

engine.Engine.prototype.Initialize = function() {
  this.ctx.clearColor(.47, .71, .99, 1.0);
  this.ctx.enable(this.ctx.DEPTH_TEST);
  this.ctx.depthFunc(this.ctx.LESS);
  this.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
}

engine.Engine.prototype.ResizeCanvas = function() {
  if (this.aspect * window.innerHeight < window.innerWidth) {
    this.canvas.width = this.aspect * window.innerHeight;
    this.canvas.height = window.innerHeight;
  } else {
    this.canvas.width =  window.innerWidth;
    this.canvas.height = window.innerWidth / this.aspect;
  }
  this.ctx.viewport(0, 0, this.canvas.width, this.canvas.height);
}

engine.Engine.prototype.EnableBlending = function() {
  this.ctx.enable(this.ctx.BLEND);
  this.ctx.disable(this.ctx.DEPTH_TEST);
  this.ctx.blendFunc(this.ctx.SRC_ALPHA, this.ctx.ONE_MINUS_SRC_ALPHA);
}

engine.Engine.prototype.DisableBlending = function() {
  this.ctx.disable(this.ctx.BLEND);
  this.ctx.enable(this.ctx.DEPTH_TEST);
}

engine.Engine.prototype.Run = function() {
  console.log("Engine run");
  var loop = new engine._Loop(this.input_handler, this.scene);
  window.requestAnimationFrame(function() {loop.Run(Date.now())});
}

engine.Engine.prototype.CreateTexture = function(
    size, color_data_type, color_data, wrap) {
  if (wrap === undefined) {
    wrap = false;
  }
  var texture = this.ctx.createTexture();
  this.ctx.bindTexture(this.ctx.TEXTURE_2D, texture);

  this.ctx.texImage2D(
     this.ctx.TEXTURE_2D,
      0,  // 'level' (from the spec: "Specifies the level-of-detail number.
          // Level 0 is the base image level. Level n is the nth mipmap
          // reduction image.
      color_data_type,  // mainly RGB or RGBA
      size, size,  // width, height
      0,  // border ("must be 0")
      color_data_type,
      this.ctx.UNSIGNED_BYTE,
      new Uint8Array(color_data));

  // TODO(cgs): revisit below defaults
  this.ctx.texParameteri(
      this.ctx.TEXTURE_2D,
      this.ctx.TEXTURE_MAG_FILTER,
      this.ctx.LINEAR);

  this.ctx.texParameteri(
      this.ctx.TEXTURE_2D,
      this.ctx.TEXTURE_MIN_FILTER,
      this.ctx.NEAREST);

  if (!wrap) {
    this.ctx.texParameteri(
        this.ctx.TEXTURE_2D,
        this.ctx.TEXTURE_WRAP_T,
        this.ctx.CLAMP_TO_EDGE);

    this.ctx.texParameteri(
        this.ctx.TEXTURE_2D,
        this.ctx.TEXTURE_WRAP_S,
        this.ctx.CLAMP_TO_EDGE);
  } else {
    this.ctx.texParameteri(
        this.ctx.TEXTURE_2D,
        this.ctx.TEXTURE_WRAP_T,
        this.ctx.REPEAT);

    this.ctx.texParameteri(
        this.ctx.TEXTURE_2D,
        this.ctx.TEXTURE_WRAP_S,
        this.ctx.REPEAT);
  }

  return texture;
}

engine._Loop = function(input_handler, scene) {
  this.input_handler = input_handler;
  this.scene = scene;
}

engine._Loop.prototype.Run = function(previous_time) {
  console.log("Loop Run");
  var self = this;
  var current_time = Date.now();
  //window.requestAnimationFrame(function() {self.Run(current_time)});
  var dt = (current_time - previous_time) / 1000.0;
  this.input_handler.Move(dt);
  this.scene.Animate(dt);
  this.scene.Draw();
}

});  // goog.scope
