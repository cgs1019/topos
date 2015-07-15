goog.provide('topos.main');
goog.require('topos.engine.Engine');
goog.require('topos.world.Lindstrom');
goog.require('topos.world.Skybox');
goog.require('topos.world.Square');
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

  var canvas = document.getElementById("canvas");

  var position = la.SquareMatrix.MakeTransform(0, -1000, -10000, 0);
  var main_engine = new engine_lib.Engine(canvas, position);
  main_engine.Initialize();

  main_engine.gl_util.EnableBlending();

  var textures = tex.LoadAllTextures(main_engine);
  var objects = main.CreateObjects(textures);
  var scene = main_engine.GetScene();
  for (var i in objects) {
    var obj = objects[i];
    console.log(i + "'s triangle count: " + (obj.vertices.length / 9));
    scene.AddObject(obj);
  }

  main_engine.Run();
}

main.CreateObjects = function(textures) {
  var sea = new world.Square(
      textures.sea,
      200000,  // size
      la.SquareMatrix.MakeTransform(0, 0, 100, 0));

  var terrain = new world.Terrain(
      world.Terrain.GenerateHeightMap(512, 512),
      1,  // height
      20000,  // size
      textures.wireframe);
      //textures.ground);
  terrain.normals = null;

  //var terrain = new world.Lindstrom(
  //    world.Terrain.GenerateHeightMap(512, 512),
  //    1,  // height
  //    20000,  // size
  //    textures.wireframe,
  //    {});

  return {
    'Terrain': terrain//,
    //'Sea': sea
  };
}

});  // goog.scope
