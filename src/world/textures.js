goog.provide('topos.world.Textures');
goog.require('topos.gl.util.GL');

goog.scope(function() {

var tex = topos.world.Textures;

tex.CreateGroundTexture = function(gl) {
  var size = 64;
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

  return tex.CreateTexture(gl, size, bytes);
}

tex.CreateSkyTexture = function(gl) {
  var size = 1;
  var bytes = [119, 181, 254];

  return tex.CreateTexture(gl, size, bytes);
}

tex.CreateTexture = function(gl, size, bytes) {
  var texture = gl.ctx.createTexture();
  gl.ctx.bindTexture(gl.ctx.TEXTURE_2D, texture);
  gl.ctx.texImage2D(
      gl.ctx.TEXTURE_2D,
      0,
      gl.ctx.RGB,
      size, size,
      0,
      gl.ctx.RGB,
      gl.ctx.UNSIGNED_BYTE,
      new Uint8Array(bytes));
  gl.ctx.texParameteri(
      gl.ctx.TEXTURE_2D,
      gl.ctx.TEXTURE_MAG_FILTER,
      gl.ctx.LINEAR);
  gl.ctx.texParameteri(
      gl.ctx.TEXTURE_2D,
      gl.ctx.TEXTURE_MIN_FILTER,
      gl.ctx.NEAREST);
  return texture;
}
});  // goog.scope
