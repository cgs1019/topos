goog.provide('topos.world.Scene');
goog.require('topos.math.LinearAlgebra.Vector');

goog.scope(function() {

var world = topos.world;
var la = topos.math.LinearAlgebra;

world.Scene = function(gl, position_matrix, light_direction) {
  this.gl = gl;
  this.position_matrix = position_matrix;
  this.light_direction = light_direction;
  this.objects = [];
  this.origin_vector = new la.Vector([0, 0, 0]);
}

world.Scene.prototype.AddObject = function(obj) {
  this.objects.push(obj.CreateMesh(this.gl));
}

world.Scene.prototype.Draw = function() {
  this.gl.ctx.clear(
      this.gl.ctx.COLOR_BUFFER_BIT | this.gl.ctx.DEPTH_BUFFER_BIT);
  this.gl.SetPositionMatrix(this.position_matrix);

  this.gl.SetDirectionalLight(this.light_direction);
  for (var i in this.objects) {
    this.gl.DrawMesh(this.objects[i]);
  }
}

world.Scene.prototype.Animate = function(dt) {
  for (var i in this.objects) {
    if (this.objects[i].animate) {
      this.objects[i].Animate(dt);
    }
  }
}

});  // goog.scope
