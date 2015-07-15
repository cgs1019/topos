goog.provide('topos.input.InputHandler')
goog.require('topos.math.LinearAlgebra.SquareMatrix');

goog.scope(function() {

var input = topos.input;
var la = topos.math.LinearAlgebra;

input.InputHandler = function(position_matrix) {
  this.position_matrix = position_matrix;
  var self = this;

  this.movement_state = {
    forward: false,
    backward: false,
    upward: false,
    downward: false,
    turn_left: false,
    turn_right: false,
    fast: false
  };

  this.fwd_translate_matrix = new la.SquareMatrix(
      4,
      [1, 0, 0, 0,
       0, 1, 0, 0,
       0, 0, 1, 0,
       0, 0, 10, 1]);

  this.back_translate_matrix = new la.SquareMatrix(
      4,
      [1, 0, 0, 0,
       0, 1, 0, 0,
       0, 0, 1, 0,
       0, 0, -10, 1]);

  this.up_translate_matrix = new la.SquareMatrix(
      4,
      [1, 0, 0, 0,
       0, 1, 0, 0,
       0, 0, 1, 0,
       0, -10, 0, 1]);

  this.down_translate_matrix = new la.SquareMatrix(
      4,
      [1, 0, 0, 0,
       0, 1, 0, 0,
       0, 0, 1, 0,
       0, 10, 0, 1]);

  var turn_rate = 1 / 120;
  this.turn_left_matrix = new la.SquareMatrix(
      4,
      [Math.cos(Math.PI * turn_rate), 0, Math.sin(Math.PI * turn_rate), 0,
       0, 1, 0, 0,
       -Math.sin(Math.PI * turn_rate), 0, Math.cos(Math.PI * turn_rate), 0,
       0, 0, 0, 1]);

  this.turn_right_matrix = new la.SquareMatrix(
      4,
      [Math.cos(-Math.PI * turn_rate), 0, Math.sin(-Math.PI * turn_rate), 0,
       0, 1, 0, 0,
       -Math.sin(-Math.PI * turn_rate), 0, Math.cos(-Math.PI * turn_rate), 0,
       0, 0, 0, 1]);

  window.addEventListener(
    'keyup', function(event) {self.KeyUp(event)}, false);
  window.addEventListener(
    'keydown', function(event) {self.KeyDown(event)}, false);
}

input.InputHandler.prototype.KeyDown = function(event) {
  if (event.keyCode == 38) {  // up arrow
    this.movement_state.forward = true;
  } else if (event.keyCode == 40) {  // down arrow
    this.movement_state.backward = true;
  } else if (event.keyCode == 50) {  // 2
    this.movement_state.upward = true;
  } else if (event.keyCode == 49) {  // 1
    this.movement_state.downward = true;
  } else if (event.keyCode == 37) {  // left arrow
    this.movement_state.turn_left = true;
  } else if (event.keyCode == 39) {  // right arrow
    this.movement_state.turn_right = true;
  } else if (event.keyCode == 16) {  // shift
    this.movement_state.fast = true;
  } else {
    this.movement_state.forward = false;
    this.movement_state.backward = false;
    this.movement_state.upward = false;
    this.movement_state.downward = false;
    this.movement_state.turn_left = false;
    this.movement_state.turn_right = false;
    this.movement_state.fast = false;
  }
}

input.InputHandler.prototype.KeyUp = function(event) {
  if (event.keyCode == 38) {  // up arrow
    this.movement_state.forward = false;
  } else if (event.keyCode == 40) {  // down arrow
    this.movement_state.backward = false;
  } else if (event.keyCode == 50) {  // 2
    this.movement_state.upward = false;
  } else if (event.keyCode == 49) {  // 1
    this.movement_state.downward = false;
  } else if (event.keyCode == 37) {  // left arrow
    this.movement_state.turn_left = false;
  } else if (event.keyCode == 39) {  // right arrow
    this.movement_state.turn_right = false;
  } else if (event.keyCode == 16) {  // shift
    this.movement_state.fast = false;
  }
}

input.InputHandler.prototype.Move = function(dt) {
  var num_moves;
  if (this.movement_state.fast) {
    num_moves = 5;
  } else {
    num_moves = 1;
  }
  if (this.movement_state.forward) {
    for (var i = 0; i < num_moves; i++) {
      this.position_matrix.Multiply(this.fwd_translate_matrix);
    }
  }
  if (this.movement_state.backward) {
    for (var i = 0; i < num_moves; i++) {
      this.position_matrix.Multiply(this.back_translate_matrix);
    }
  }
  if (this.movement_state.upward) {
    for (var i = 0; i < num_moves; i++) {
      this.position_matrix.Multiply(this.up_translate_matrix);
    }
  }
  if (this.movement_state.downward) {
    for (var i = 0; i < num_moves; i++) {
      this.position_matrix.Multiply(this.down_translate_matrix);
    }
  }
  if (this.movement_state.turn_left) {
    this.position_matrix.Multiply(this.turn_left_matrix);
  }
  if (this.movement_state.turn_right) {
    this.position_matrix.Multiply(this.turn_right_matrix);
  }
}

});  // goog.scope
