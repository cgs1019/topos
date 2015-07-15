goog.provide('topos.engine.Engine');
goog.require('topos.gl.util.GlUtil');
goog.require('topos.input.InputHandler');
goog.require('topos.math.LinearAlgebra.SquareMatrix');
goog.require('topos.math.LinearAlgebra.Vector');

goog.scope(function() {

var engine = topos.engine;
var util = topos.gl.util;
var input = topos.input;
var la = topos.math.LinearAlgebra;
var world = topos.world;

engine.Engine = function(canvas, initial_position) {
  var aspect = 16 / 9;
  this.gl_util = new util.GlUtil(aspect, canvas);

  var light_direction = new la.Vector([-1, -1, 0]).Normalize();

  this.input_handler = new input.InputHandler(initial_position);
  this.scene = new world.Scene(this.gl_util, initial_position, light_direction);
}

engine.Engine.prototype.Initialize = function() {
  this.gl_util.Initialize();
}

engine.Engine.prototype.Run = function() {
  var loop = new engine._Loop(this.gl_util, this.input_handler, this.scene);
  window.requestAnimationFrame(function() {loop.Run(Date.now())});
}

engine.Engine.prototype.GetScene = function() {
  return this.scene;
}

engine.Engine.prototype.GetCtx = function() {
  return this.gl_util.ctx;
}

engine.Engine.prototype.CreateTexture = function(size, color_data_type, color_data) {
  var texture = this.gl_util.ctx.createTexture();
  this.gl_util.ctx.bindTexture(this.gl_util.ctx.TEXTURE_2D, texture);

  this.gl_util.ctx.texImage2D(
     this.gl_util.ctx.TEXTURE_2D,
      0,  // 'level' (from the spec: "Specifies the level-of-detail number.
          // Level 0 is the base image level. Level n is the nth mipmap
          // reduction image.
      color_data_type,  // mainly RGB or RGBA
      size, size,  // width, height
      0,  // border ("must be 0")
      color_data_type,
      this.gl_util.ctx.UNSIGNED_BYTE,
      new Uint8Array(color_data));

  // TODO(cgs): revisit below defaults
  this.gl_util.ctx.texParameteri(
      this.gl_util.ctx.TEXTURE_2D,
      this.gl_util.ctx.TEXTURE_MAG_FILTER,
      this.gl_util.ctx.LINEAR);

  this.gl_util.ctx.texParameteri(
      this.gl_util.ctx.TEXTURE_2D,
      this.gl_util.ctx.TEXTURE_MIN_FILTER,
      this.gl_util.ctx.NEAREST);

  this.gl_util.ctx.texParameteri(
      this.gl_util.ctx.TEXTURE_2D,
      this.gl_util.ctx.TEXTURE_WRAP_T,
      this.gl_util.ctx.CLAMP_TO_EDGE);

  this.gl_util.ctx.texParameteri(
      this.gl_util.ctx.TEXTURE_2D,
      this.gl_util.ctx.TEXTURE_WRAP_S,
      this.gl_util.ctx.CLAMP_TO_EDGE);

  return texture;
}

engine._Loop = function(gl_util, input_handler, scene) {
  this.gl_util = gl_util;
  this.input_handler = input_handler;
  this.scene = scene;
}

engine._Loop.prototype.Run = function(previous_time) {
  var self = this;
  var current_time = Date.now();
  window.requestAnimationFrame(function() {self.Run(current_time)});
  var dt = (current_time - previous_time) / 1000.0;
  this.input_handler.Move(dt);
  this.scene.Animate(dt);
  this.scene.Draw();
}

});  // goog.scope
