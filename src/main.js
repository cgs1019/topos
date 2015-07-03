goog.provide('topos.main');
goog.require('topos.gl.util.GL');
goog.require('topos.input.InputHandler');
goog.require('topos.world.Scene');
goog.require('topos.world.Skybox');
goog.require('topos.world.Textures');
goog.require('topos.math.LinearAlgebra.SquareMatrix');
goog.require('topos.math.LinearAlgebra.Vector');

goog.scope(function() {

var gl_util = topos.gl.util;
var input = topos.input;
var la = topos.math.LinearAlgebra;
var main = topos.main;
var world = topos.world;

main.Start = function() {
  Math.seedrandom("cgs");

  var aspect = 16 / 9;
  var canvas = document.getElementById("canvas");
  var gl = new gl_util.GL(aspect, canvas);
  gl.Initialize();

  // resize the canvas to fill browser window dynamically
  window.addEventListener(
      'resize',
      function() {
        ResizeCanvas(aspect, canvas, gl.ctx);
      },
      false);
  ResizeCanvas(aspect, canvas, gl.ctx);

  var ground_texture = world.Textures.CreateGroundTexture(gl);
  var terrain_transformation_matrix =
      la.SquareMatrix.MakeTransform(0, 0, 0, Math.PI / 4);
  var terrain = new world.Terrain(
    ground_texture, terrain_transformation_matrix);

  var skybox_transformation_matrix = la.SquareMatrix.MakeTransform(0, 0, 0, 0);
  var sky_texture = world.Textures.CreateSkyTexture(gl);
  var skybox = new world.Skybox(
    sky_texture, skybox_transformation_matrix);

  var position_matrix = la.SquareMatrix.MakeTransform(0, -20, 100, 0);
  var light_direction = new la.Vector([-1, -1, 0]).Normalize();

  var input_handler = new topos.input.InputHandler(position_matrix);
  var scene = new world.Scene(gl, position_matrix, light_direction);
  scene.AddMesh(terrain.CreateMesh(gl));
  scene.AddMesh(skybox.CreateMesh(gl));

  var loop = new main.Loop(gl, input_handler, scene);
  window.requestAnimationFrame(function() {loop.Run()});
}

main.Loop = function(gl, input_handler, scene) {
  this.gl = gl;
  this.input_handler = input_handler;
  this.scene = scene;
}

main.Loop.prototype.Run = function() {
  var self = this;
  window.requestAnimationFrame(function() {self.Run()});
  this.input_handler.Move(0);
  this.scene.Draw();
}

function ResizeCanvas(aspect, canvas, gl_ctx) {
  if (aspect * window.innerHeight < window.innerWidth) {
    canvas.width = aspect * window.innerHeight;
    canvas.height = window.innerHeight;
  } else {
    canvas.width =  window.innerWidth;
    canvas.height = window.innerWidth / aspect;
  }
  gl_ctx.viewport(0, 0, canvas.width, canvas.height);
}

});  // goog.scope
