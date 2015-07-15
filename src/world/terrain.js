goog.provide('topos.world.Terrain');
goog.require('topos.math.LinearAlgebra.Vector');
goog.require('topos.gl.Mesh');

goog.scope(function() {

var la = topos.math.LinearAlgebra;
var world = topos.world;

world.Terrain = function(height_map, height, size, ground_texture) {
  this.texture = ground_texture;
  this.transformation_matrix =
      la.SquareMatrix.MakeTransform(0, 0, 0, 0);

  var width = height_map.length;
  var depth = height_map[0].length;

  var compute_normal = function(x, z) {
    var normal = la.Vector([0, 0, 0]);

    var x_right = x < width - 1 ? x + 1 : x;
    var x_left = x > 0 ? x - 1 : x;

    var sx = height_map[x_left][z] - height_map[x_right][z];
    if (x == 0 || x == width - 1) {
      sx *= 2;
    }

    var z_front = z < depth - 1 ? z + 1 : z;
    var z_back = z > 0 ?  z - 1 : z;

    var sz = height_map[x][z_front] - height_map[x][z_back];
    if (z == 0 || z == depth -1) {
      sz *= 2;
    }

    return new la.Vector([-sx, -200, sz]).Normalize();
  }

  this.vertices = [];
  this.normals = [];
  for (var z = 0; z < depth - 1; z++) {
    for (var x = 0; x < width - 1; x++) {
      var v1 = [x, z];
      var v2 = [x + 1, z];
      var v3 = [x + 1, z + 1];
      var v4 = [x, z + 1];
      var normal;
      var tris = [[v1, v2, v3], [v1, v3, v4]];

      for (var tri_idx in tris) {
        var tri = tris[tri_idx];

        for (var vert_idx in tri) {
          var vert = tri[vert_idx];
          this.vertices.push(-size / 2 + vert[0] * size / width)
          this.vertices.push(-50 + height_map[vert[0]][vert[1]]);
          this.vertices.push(-size / 2 + vert[1] * size / depth)

          var normal = compute_normal(vert[0], vert[1]);
          this.normals.push(normal.data[0],
                            normal.data[1],
                            normal.data[2]);
        }
      }
    }
  }

  this.texture_coords = [];
  for (var z = 0; z < depth - 1; z++) {
    for (var x = 0; x < width - 1; x++) {
      this.texture_coords.push(0, 0,  0, 1,  1, 1,
                               0, 0,  1, 1,  1, 0);
    }
  }
}

world.Terrain.prototype.CreateMesh = function(gl) {
  return new topos.gl.Mesh(
    gl,
    this.vertices,
    this.texture_coords,
    this.texture,
    this.transformation_matrix,
    this.normals);
}

world.Terrain.GenerateHeightMap = function(width, depth) {
  var height_map = [];

  var mag1 = 5000;
  var mag2 = 100;
  var mag3 = 10;

  for (var z = 0; z < depth; z++) {
    var row = [];
    for (var x = 0; x < width; x++) {
      var dx = 2 * x - width;
      var dz = 2 * z - depth;
      var sigma_sq = width * width / 16
      row.push(mag1 * Math.exp(-.5 * (dx * dx + dz * dz) / sigma_sq));
    }
    height_map.push(row);
  }

  var med_texture_seed = []
  for (var z = 0; z < depth; z++) {
    var row = [];
    for (var x = 0; x < width; x++) {
      row.push(Math.random());
    }
    med_texture_seed.push(row);
  }

  var med_texture = [];
  for (var z = 0; z < depth; z++) {
    row = [];
    for (var x = 0; x < width; x++) {
      var n = 0;
      var value = 0;
      for (var a = -1; a <= 1; a++) {
        for (var b = -1; b <= 1; b++) {
          var seed_z = ((z + depth + a) % depth);
          var seed_x = ((x + width + b) % width);
          value += med_texture_seed[seed_z][seed_x];
          n++;
        }
      }
      value /= n;
      row.push(value);
    }
    med_texture.push(row);
  }

  var fine_texture = [];
  for (var z = 0; z < depth; z++) {
    row = [];
    for (var x = 0; x < width; x++) {
      row.push(Math.random());
    }
    fine_texture.push(row);
  }

  for (var z = 0; z < depth; z++) {
    for (var x = 0; x < width; x++) {
      height_map[z][x] +=
          mag2 * 2 * (med_texture[z][x] - .5) +
          mag3 * 2 * (fine_texture[z][x] - .5);
    }
  }

  return height_map;
}

});
