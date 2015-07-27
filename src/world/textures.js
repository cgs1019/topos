goog.provide('topos.world.Textures');

goog.scope(function() {

var tex = topos.world.Textures;

tex.LoadAllTextures = function(engine) {
  var textures = {};

  //textures.ground = engine.CreateTexture(
  //    1,
  //    engine.ctx.RGB,
  //    [100, 150, 30]);

  textures.ground = engine.CreateTexture(
      64,
      engine.ctx.RGB,
      tex.CreateGroundTextureData(64),
      true  /* wrap */);

  textures.sky = engine.CreateTexture(
      1,
      engine.ctx.RGB,
      [119, 181, 254]);

  textures.wireframe = engine.CreateTexture(
      256,
      engine.ctx.RGBA,
      tex.CreateWireframeTextureData(256));

  textures.sea = engine.CreateTexture(
      1,
      engine.ctx.RGB,
      [0, 80, 150]);

  return textures;
}

tex.CreateGroundTextureData = function(size) {
  var seed_bytes = [];
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      seed_bytes[seed_bytes.length] = 200 * Math.random();
      seed_bytes[seed_bytes.length] = 100 + 100 * Math.random();
      seed_bytes[seed_bytes.length] = 50 * Math.random();
    }
  }

  var bytes = seed_bytes.slice();
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      for (var k = 0; k < 3; k++) {
        var n = 0;
        if (k == 1) {
          bytes[3 * (i * size + j) + k] = 255 * Math.random();
          n++;
        }
        for (var a = -1; a <= 1; a++) {
          for (var b = -1; b <= 1; b++) {
            var seed_i = ((i + size + a) % size);
            var seed_j = ((j + size + b) % size);
            bytes[3 * (i * size + j) + k] +=
                seed_bytes[3 * (seed_i * size + seed_j) + k];
            n++;
          }
        }
        bytes[3 * (i * size + j) + k] /= n;
      }
    }
  }

  return bytes;
}

tex.CreateWireframeTextureData = function(size) {
  var bytes = [];
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      if (i < size / 64 ||
          j < size / 64 ||
          i >= size - size / 64 ||
          j >= size - size / 64 ||
          Math.abs(i - j) < size / 64) {
        bytes.push(0);
        bytes.push(0);
        bytes.push(0);
        bytes.push(255);
      } else {
        bytes.push(0);
        bytes.push(0);
        bytes.push(0);
        bytes.push(0);
      }
    }
  }
  return bytes;
}

});  // goog.scope
