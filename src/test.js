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

  var aspect = 16 / 9;
  var canvas = document.getElementById("canvas");

  var position = la.SquareMatrix.MakeTransform(0, -50, -300, -5 * Math.PI / 8);
  var perspective_matrix = la.SquareMatrix.MakePerspective(45, aspect, 1);
  var main_engine = new engine_lib.Engine(canvas, position, perspective_matrix);
  main_engine.Initialize();

  main_engine.gl_util.EnableBlending();

  var textures = tex.LoadAllTextures(main_engine);
  var objects = test.CreateObjects(textures);
  var scene = main_engine.GetScene();
  for (var i in objects) {
    var obj = objects[i];
    scene.AddObject(obj);
  }

  main_engine.Run();
}

test.CreateObjects = function(textures) {
  var lindstrom = new world.Lindstrom(
      world.Lindstrom.GenerateTestHeightMap(33),
      200,
      textures.wireframe,
      {});

  return {
    //'Lindstrom': lindstrom
  };
}

});  // goog.scope
