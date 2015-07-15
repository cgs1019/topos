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

la.SquareMatrix.prototype.Times = function(m) {
  var new_data = this.data.slice();
  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j++) {
      new_data[i * this.size + j] = 0;
      for (var k = 0; k < this.size; k++) {
        new_data[i * this.size + j] +=
            this.data[i * this.size + k] * m.data[k * this.size + j];
      }
    }
  }
  return new la.SquareMatrix(this.size, new_data);
}

la.SquareMatrix.prototype.Pow = function(n) {
  if (n < 0) {
    return la.SquareMatrix.Pow(-n).Inverse();
  }
  if (n == 0) {
    return la.SquareMatrix.Identity(this.size);
  }
  if (n == 1) {
    return new la.SquareMatrix(this.size, this.data);
  }
  if (n % 2 == 0) {
    return this.Pow(n / 2).Times(this.Pow(n / 2));
  }
  return this.Times(this.Pow(n - 1));
}

la.SquareMatrix.prototype.AsFloat32Array = function() {
  return new Float32Array(this.data);
}

la.SquareMatrix.prototype.Inverse = function() {
  var det = this.Determinant();
  if (det == 0) {
    throw "Matrix is non-invertible (zero determinant).";
  }
  var data = [];
  for (var j = 0; j < this.size; j++) {
    for (var i = 0; i < this.size; i++) {
      data.push(this.Cofactor(i, j) / det);
    }
  }
  return new la.SquareMatrix(this.size, data);
}

la.SquareMatrix.prototype.Cofactor = function(i, j) {
  if (this.size == 1) {
    return this.data[0];
  }
  var sign = Math.pow(-1, (i + j));
  return sign * this.Minor(i, j).Determinant();
}

la.SquareMatrix.prototype.Minor = function(i, j) {
  var data = [];
  for (var a = 0; a < this.size; a++) {
    for (var b = 0; b < this.size; b++) {
      if (a != i && b != j) {
        data.push(this.data[a * this.size + b]);
      }
    }
  }
  return new la.SquareMatrix(this.size - 1, data);
}

la.SquareMatrix.prototype.Determinant = function() {
  if (this.size == 1) {
    return this.data[0];
  }
  var det = 0;
  for (var i = 0; i < this.size; i++) {
    det += this.data[i] * this.Cofactor(0, i);
  }
  return det;
}

la.SquareMatrix.prototype.Transpose = function() {
  var data = [];
  for (i = 0; i < this.size; i++) {
    for (j = 0; j < this.size; j++) {
      data[j * this.size + i] = this.data[i * this.size + j];
    }
  }
  return new la.SquareMatrix(this.size, data);
}

la.SquareMatrix.Identity = function(size) {
  var data = [];
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      data[i * size + j] = (i == j) ? 1 : 0;
    }
  }
  return new la.SquareMatrix(size, data);
}

la.SquareMatrix.MakePerspective = function(fov, aspect, near) {
  var tan = Math.tan(fov * Math.PI / 360);
  var a = 1 / (tan * aspect);
  var b = 1 / (tan);
  return new la.SquareMatrix(4, [
      a, 0, 0, 0,
      0, b, 0, 0,
      0, 0, 0, -1,
      0, 0, -near, 0
  ]);
}

la.SquareMatrix.MakeTransform = function(x, y, z, angle) {
  var a = Math.cos(angle);
  var b = Math.sin(angle);
  return new la.SquareMatrix(4, [
       a, 0, b, 0,
       0, 1, 0, 0,
      -b, 0, a, 0,
       x, y, z, 1
  ]);
}

la.SquareMatrix.prototype.ToString = function() {
  var result = "\n";
  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j++) {
      result += Math.round(this.data[i * this.size + j] * 100) / 100 + " ";
    }
    result += "\n";
  }
  result += "\n";
  return result;
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

la.Vector.prototype.MatrixMultiply = function(m) {
  if (m.size != this.size) {
    throw m.size + "x" + m.size + " SquareMatrix and " +
        "dimension " + this.size + " Vector are mis-aligned";
  }
  var data = [];
  for (var i = 0; i < m.size; i++) {
    data.push(0);
    for (var j = 0; j < m.size; j++) {
      data[i] += m.data[i * this.size + j] * this.data[j];
    }
  }
  return new la.Vector(data);
}

la.Vector.prototype.Dot = function(v) {
  var dot = 0;
  for (var i = 0; i < this.size; i++) {
    dot += this.data[i] * v.data[i];
  }
  return dot;
}

la.Vector.prototype.Add = function(v) {
  for (var i = 0; i < this.size; i++) {
    this.data[i] += v.data[i];
  }
  return this;
}

la.Vector.prototype.Sum = function(v) {
  var data = [];
  for (var i = 0; i < this.size; i++) {
    data.push(this.data[i] + v.data[i]);
  }
  return new la.Vector(data);
}

la.Vector.prototype.Subtract = function(v) {
  for (var i = 0; i < this.size; i++) {
    this.data[i] -= v.data[i];
  }
  return this;
}

la.Vector.prototype.Difference = function(v) {
  var data = [];
  for (var i = 0; i < this.size; i++) {
    data.push(this.data[i] - v.data[i]);
  }
  return new la.Vector(data);
}

la.Vector.prototype.Scale = function(scalar) {
  for (var i = 0; i < this.size; i++) {
    this.data[i] *= scalar;
  }
  return this;
}

});  // goog.scope
