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
    turn_left: false,
    turn_right: false
  };

  this.fwd_translate_matrix = new la.SquareMatrix(
      4,
      [1, 0, 0, 0,
       0, 1, 0, 0,
       0, 0, 1, 0,
       0, 0, 5, 1]);

  this.back_translate_matrix = new la.SquareMatrix(
      4,
      [1, 0, 0, 0,
       0, 1, 0, 0,
       0, 0, 1, 0,
       0, 0, -5, 1]);

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
  if (event.keyCode == 38) {  // up
    this.movement_state.forward = true;
  } else if (event.keyCode == 40) {  // down
    this.movement_state.backward = true;
  } else if (event.keyCode == 37) {  // down
    this.movement_state.turn_left = true;
  } else if (event.keyCode == 39) {  // down
    this.movement_state.turn_right = true;
  } else {
    this.movement_state.forward = false;
    this.movement_state.backward = false;
    this.movement_state.turn_left = false;
    this.movement_state.turn_right = false;
  }
}

input.InputHandler.prototype.KeyUp = function(event) {
  if (event.keyCode == 38) {  // up
    this.movement_state.forward = false;
  } else if (event.keyCode == 40) {  // down
    this.movement_state.backward = false;
  } else if (event.keyCode == 37) {  // down
    this.movement_state.turn_left = false;
  } else if (event.keyCode == 39) {  // down
    this.movement_state.turn_right = false;
  }
}

input.InputHandler.prototype.Move = function(dt) {
  if (this.movement_state.forward) {
    this.position_matrix.Multiply(this.fwd_translate_matrix);
  }
  if (this.movement_state.backward) {
    this.position_matrix.Multiply(this.back_translate_matrix);
  }
  if (this.movement_state.turn_left) {
    this.position_matrix.Multiply(this.turn_left_matrix);
  }
  if (this.movement_state.turn_right) {
    this.position_matrix.Multiply(this.turn_right_matrix);
  }
}

});  // goog.scope
