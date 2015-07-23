goog.provide('topos.test');

goog.require('topos.engine.Engine');
goog.require('topos.world.Lindstrom');
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

  var aspect = 16 / 9;
  var canvas = document.getElementById("canvas");

  var position_matrix = la.SquareMatrix.MakeTransform(
      0, -10000, -40000, 0);
  var perspective_matrix = la.SquareMatrix.MakePerspective(45, aspect, 1);

  var main_engine = new engine_lib.Engine(
      canvas, aspect, position_matrix, perspective_matrix);
  main_engine.Initialize();

  main_engine.gl_util.EnableBlending();

  var textures = tex.LoadAllTextures(main_engine);
  var objects = test.CreateObjects(
      main_engine.gl_util, textures, position_matrix, perspective_matrix);
  var scene = main_engine.GetScene();
  for (var i in objects) {
    var obj = objects[i];
    scene.AddObject(obj);
  }

  main_engine.Run();
}

test.CreateObjects = function(gl_util, textures, position_matrix, perspective_matrix) {
  var lindstrom = new world.Lindstrom(
      gl_util,
      world.Lindstrom.GenerateTestHeightMap(5, 20000),
      //world.Terrain.GenerateHeightMap(17, 17),
      20000,
      textures.wireframe,
      position_matrix,
      perspective_matrix,
      {});

  //var lindstrom = new world.Terrain(
  //    gl_util,
  //    world.Lindstrom.GenerateTestHeightMap(33),
  //    1,
  //    20000,
  //    textures.wireframe);

  return {
    'Lindstrom': lindstrom
  };
}

});  // goog.scope
