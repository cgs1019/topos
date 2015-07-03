goog.provide('topos.math.LinearAlgebra.SquareMatrix');
goog.provide('topos.math.LinearAlgebra.Vector');

goog.scope(function() {

var la = topos.math.LinearAlgebra;

la.SquareMatrix = function(size, data) { 
  this.size = size;
  this.data = data;
} 

la.SquareMatrix.prototype.Multiply = function(m) {
  var copy = this.data.slice();
  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j++) {
      this.data[i * this.size + j] = 0;
      for (var k = 0; k < this.size; k++) {
        this.data[i * this.size + j] +=
            copy[i * this.size + k] * m.data[k * this.size + j];
      }
    }
  }
}

la.SquareMatrix.prototype.AsFloat32Array = function() {
  return new Float32Array(this.data);
}

la.SquareMatrix.MakePerspective = function(fov, aspect, near, far) {
  var y_limit = near * Math.tan(fov * Math.PI / 360);
  var a = -( far + near ) / ( far - near );
  var b = -2 * far * near / ( far - near );
  var c = (2 * near) / ( (y_limit * aspect) * 2 );
  var d = (2 * near) / ( y_limit * 2 );
  return new la.SquareMatrix(4, [
      c, 0, 0, 0,
      0, d, 0, 0,
      0, 0, a, -1,
      0, 0, b, 0
  ]);
}

la.SquareMatrix.MakeTransform = function(x, y, depth, angle) {
  var a = Math.cos(angle);
  var b = Math.sin(angle);
  return new la.SquareMatrix(4, [
      a, 0, b, 0,
      0, 1, 0, 0,
      -b, 0, a, 0,
      x, y, -depth, 1
  ]);
}

la.Vector = function(data) {
  this.size = data.length;
  this.data = data;
}

la.Vector.prototype.CrossProduct = function(v) {
  if (v.size != 3 || this.size != 3) {
    throw "Can't form cross product of vectors with dimension != 3";
  }
  return new la.Vector([
    this.data[1] * v.data[2] - this.data[2] * v.data[1],
    this.data[2] * v.data[0] - this.data[0] * v.data[2],
    this.data[0] * v.data[1] - this.data[1] * v.data[0]
  ]);
}

la.Vector.prototype.Normalize = function() {
  var length = this.Length();
  for (var i = 0; i < this.size; i++) {
    this.data[i] /= length;
  }
  return this;
}

la.Vector.prototype.Length = function() {
  return Math.sqrt(this.Dot(this));
}

la.Vector.prototype.Dot = function(v) {
  var dot = 0;
  for (var i = 0; i < this.size; i++) {
    dot += this.data[i] * v.data[i];
  }
  return dot;
}

la.Vector.prototype.Add = function(v) {
  this.data[0] += v.data[0];
  this.data[1] += v.data[1];
  this.data[2] += v.data[2];
  return this;
}

la.Vector.prototype.Sum = function(v) {
  return new la.Vector([
    this.data[0] + v.data[0],
    this.data[1] + v.data[1],
    this.data[2] + v.data[2]]);
}

la.Vector.prototype.Subtract = function(v) {
  this.data[0] -= v.data[0];
  this.data[1] -= v.data[1];
  this.data[2] -= v.data[2];
  return this;
}

la.Vector.prototype.Difference = function(v) {
  return new la.Vector([
    this.data[0] - v.data[0],
    this.data[1] - v.data[1],
    this.data[2] - v.data[2]]);
}

la.Vector.prototype.Scale = function(scalar) {
  this.data[0] *= scalar;
  this.data[1] *= scalar;
  this.data[2] *= scalar;
  return this;
}

});  // goog.scope
