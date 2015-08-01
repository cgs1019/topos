goog.provide('topos.test');
goog.require('topos.engine.Engine');
goog.require('topos.world.terrain.Terrain');
goog.require('topos.world.Textures');
goog.require('topos.math.LinearAlgebra.SquareMatrix');
goog.require('topos.math.Lindstrom');

goog.scope(function() {

var engine_lib = topos.engine;
var la = topos.math.LinearAlgebra;
var math = topos.math;
var test = topos.test;
var tex = topos.world.Textures;
var terrain = topos.world.terrain;

test.Start = function() {
  Math.seedrandom("cgs");

  var aspect = 16 / 9;
  var canvas = document.getElementById("canvas");

  var position_matrix = la.SquareMatrix.MakeTransform(0, -3000, -30000, -2.5 * Math.PI / 8);
  var perspective_matrix = la.SquareMatrix.MakePerspective(45, aspect, 1);

  var main_engine = new engine_lib.Engine(
      canvas, aspect, position_matrix, perspective_matrix,
      false  /* debug */);
  main_engine.Initialize();

  main_engine.EnableBlending();

  var textures = tex.LoadAllTextures(main_engine);
  var objects = test.CreateObjects(
      main_engine.ctx, textures, position_matrix, perspective_matrix);
  var scene = main_engine.scene;
  for (var i in objects) {
    var obj = objects[i];
    console.log("Adding obj " + i);
    scene.AddObject(obj);
  }

  main_engine.Run();
}

test.CreateObjects = function(ctx, textures, position_matrix, perspective_matrix) {
  var extent = 20000;
  var terrain_obj = new terrain.Terrain(
      ctx,
      math.Lindstrom.GenerateTestHeightMap(33, extent),
      extent,
      textures.wireframe,
      position_matrix,
      perspective_matrix);

  return {
    'Terrain': terrain_obj
  };
}

});  // goog.scope
