goog.provide('topos.test');

goog.require('topos.engine.Engine');
goog.require('topos.world.Lindstrom');
goog.require('topos.world.Skybox');
goog.require('topos.world.Square');
goog.require('topos.world.Terrain');
goog.require('topos.world.Textures');
goog.require('topos.math.LinearAlgebra.SquareMatrix');

goog.scope(function() {

var engine_lib = topos.engine;
var test = topos.test;
var tex = topos.world.Textures;
var world = topos.world;
var la = topos.math.LinearAlgebra;

test.Start = function() {
  Math.seedrandom("cgs");

  var canvas = document.getElementById("canvas");

  var position = la.SquareMatrix.MakeTransform(0, -50, -300, -5 * Math.PI / 8);
  var main_engine = new engine_lib.Engine(canvas, position);
  main_engine.Initialize();

  main_engine.gl_util.EnableBlending();

  var textures = tex.LoadAllTextures(main_engine);
  var objects = test.CreateObjects(textures);
  var scene = main_engine.GetScene();
  for (var i in objects) {
    var obj = objects[i];
    console.log(i + "'s triangle count: " + (obj.vertices.length / 9));
    scene.AddObject(obj);
  }

  main_engine.Run();
}

test.CreateObjects = function(textures) {
  var skybox = new world.Skybox(textures.sky);

  var lindstrom = new world.Lindstrom(
      world.Lindstrom.GenerateTestHeightMap(5),
      100,
      textures.wireframe,
      {});

  return {
    //'Lindstrom': lindstrom
  };
}

//test._CreateLindstromSurface = function(gl) {
//  var width = 9;
//  var depth = 9;
//  var height = 200;
//  var height_map = [];
//  var size = 100;
//
//  var tree_depth = 2;
//  var width = Math.pow(2, tree_depth) + 1;
//  var depth = Math.pow(2, tree_depth) + 1;
//  var height_map = world.Lindstrom.GenerateTestHeightMap(width, depth);
//
//  var wireframe_texture = world.Textures.CreateWireframe(gl);
//
//  return new world.Lindstrom(
//      height_map, height, tree_depth, size, wireframe_texture, {});
//}

});  // goog.scope
