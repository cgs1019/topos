goog.provide('topos.main');
goog.require('topos.engine.Engine');
goog.require('topos.world.Lindstrom');
goog.require('topos.world.Terrain');
goog.require('topos.world.Textures');
goog.require('topos.math.LinearAlgebra.SquareMatrix');

goog.scope(function() {

var engine_lib = topos.engine;
var main = topos.main;
var tex = topos.world.Textures;
var world = topos.world;
var la = topos.math.LinearAlgebra;

main.Start = function() {
  Math.seedrandom("cgs");

  var aspect = 16 / 9;
  var canvas = document.getElementById("canvas");

  var position_matrix = la.SquareMatrix.MakeTransform(0, -1000, -10000, 0);
  var perspective_matrix = la.SquareMatrix.MakePerspective(45, aspect, 1);
  var main_engine = new engine_lib.Engine(
      canvas, aspect, position_matrix, perspective_matrix);
  main_engine.Initialize();

  //main_engine.gl_util.EnableBlending();

  var textures = tex.LoadAllTextures(main_engine);
  var objects = main.CreateObjects(main_engine.gl_util, textures);
  var scene = main_engine.GetScene();
  for (var i in objects) {
    var obj = objects[i];
    scene.AddObject(obj);
  }

  main_engine.Run();
}

main.CreateObjects = function(gl_util, textures) {
  //var sea = new world.Square(
  //    textures.sea,
  //    200000,  // size
  //    la.SquareMatrix.MakeTransform(0, 0, 100, 0));

  var terrain = new world.Terrain(
      gl_util,
      world.Terrain.GenerateHeightMap(512, 512),
      1,  // height
      20000,  // size
      //textures.wireframe);
      textures.ground);
  terrain.normals = null;

  //var terrain = new world.Lindstrom(
  //    world.Terrain.GenerateHeightMap(512, 512),
  //    1,  // height
  //    20000,  // size
  //    textures.wireframe,
  //    {});

  return {
    'Terrain': terrain
  };
}

});  // goog.scope
