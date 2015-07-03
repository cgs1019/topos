goog.provide('topos.world.Terrain');
goog.require('topos.math.LinearAlgebra.Vector');
goog.require('topos.gl.Mesh');

goog.scope(function() {

var la = topos.math.LinearAlgebra;
var world = topos.world;

world.Terrain = function(ground_texture, transformation_matrix) {
  this.texture = ground_texture;
  this.transformation_matrix = transformation_matrix;
  var size = 1000;
  var spacing = 10;
  var height = 50;
  var triangle_offsets_by_vertex = {};

  this.vertices = [];
  for (var i = 0; i < spacing; i++) {
    for (var j = 0; j < spacing; j++) {
      this.vertices.push(-(size / 2) + (size / spacing) * i);
      this.vertices.push(-height + height * Math.random());
      this.vertices.push(-(size / 2) + (size / spacing) * j);
      triangle_offsets_by_vertex[i * spacing + j] = [];
    }
  }

  this.triangles = [];
  var triangle_num = 0;
  for (var i = 0; i < spacing - 1; i++) {
    for (var j = 0; j < spacing - 1; j++) {
      var v1 = i * spacing + j;
      var v2 = i * spacing + j + spacing;
      var v3 = i * spacing + j + spacing + 1;
      var v4 = i * spacing + j + 1;
      this.triangles.push(v1);
      this.triangles.push(v2);
      this.triangles.push(v3);
      triangle_offsets_by_vertex[v1].push(triangle_num);
      triangle_offsets_by_vertex[v2].push(triangle_num);
      triangle_offsets_by_vertex[v3].push(triangle_num);
      triangle_num++;

      this.triangles.push(v1);
      this.triangles.push(v3);
      this.triangles.push(v4);
      triangle_offsets_by_vertex[v1].push(triangle_num);
      triangle_offsets_by_vertex[v3].push(triangle_num);
      triangle_offsets_by_vertex[v4].push(triangle_num);
      triangle_num++;
    }
  }

  this.texture_coords = [];
  for (var i = 0; i < spacing - 1; i++) {
    for (var j = 0; j < spacing - 1; j++) {
      this.texture_coords.push(0, 0,
                               1, 0,
                               1, 1,
                               0, 1);
    }
  }

  this.normals = [];
  for (var i = 0; i < spacing; i++) {
    for (var j = 0; j < spacing; j++) {
      var vertex_offset = i * spacing + j;
      var vertex_normal = new la.Vector([0, 0, 0]);
      for (var triangle_offset in triangle_offsets_by_vertex[vertex_offset]) {
        var v1_idx = this.triangles[triangle_offset * 3] * 3;
        var v2_idx = this.triangles[triangle_offset * 3 + 1] * 3;
        var v3_idx = this.triangles[triangle_offset * 3 + 2] * 3;
        var v1_vector = new la.Vector(
            this.vertices.slice(v1_idx, v1_idx + 3));
        var v2_vector = new la.Vector(
            this.vertices.slice(v2_idx, v2_idx + 3));
        var v3_vector = new la.Vector(
            this.vertices.slice(v3_idx, v3_idx + 3));
        var triangle_normal = v1_vector.Difference(v2_vector)
            .CrossProduct(v1_vector.Difference(v3_vector))
            .Normalize();
        vertex_normal.Add(triangle_normal);
      }
      vertex_normal
          .Scale(1.0 / triangle_offsets_by_vertex[vertex_offset].length)
          .Normalize();
      console.log(vertex_normal.Dot(new la.Vector([-1, 0, 0]).Normalize()));
      this.normals.push(vertex_normal.data[0],
                        vertex_normal.data[1],
                        vertex_normal.data[2]);
    }
  }
}

world.Terrain.prototype.CreateMesh = function(gl) {
  return new topos.gl.Mesh(
    gl,
    this.vertices,
    this.triangles,
    this.texture_coords,
    this.texture,
    this.transformation_matrix,
    this.normals);
}

});
