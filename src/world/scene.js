goog.provide('topos.world.Scene');
goog.require('topos.math.LinearAlgebra.Vector');

goog.scope(function() {

var world = topos.world;
var la = topos.math.LinearAlgebra;

world.Scene = function(ctx, position_matrix, light_direction) {
  this.ctx = ctx;
  this.position_matrix = position_matrix;
  this.light_direction = light_direction;
  this.objects = [];
  this.origin_vector = new la.Vector([0, 0, 0]);
}

world.Scene.prototype.AddObject = function(obj) {
  this.objects.push(obj);
}

world.Scene.prototype.Draw = function() {
  console.log("Drawing scene");
  this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | this.ctx.DEPTH_BUFFER_BIT);

  for (var i in this.objects) {
    this.objects[i].Draw();
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
