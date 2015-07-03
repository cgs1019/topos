goog.provide('topos.world.Scene');

goog.scope(function() {

var world = topos.world;

world.Scene = function(gl, position_matrix, light_direction) {
  this.gl = gl;
  this.position_matrix = position_matrix;
  this.light_direction = light_direction;
  this.meshes = [];
}

world.Scene.prototype.AddMesh = function(mesh) {
  this.meshes.push(mesh);
}

world.Scene.prototype.Draw = function() {
  this.gl.ctx.clear(
      this.gl.ctx.COLOR_BUFFER_BIT | this.gl.ctx.DEPTH_BUFFER_BIT);
  this.gl.SetPositionMatrix(this.position_matrix);
  this.gl.SetDirectionalLight(this.light_direction);
  for (var i in this.meshes) {
    this.gl.DrawMesh(this.meshes[i]);
  }
}

});  // goog.scope
