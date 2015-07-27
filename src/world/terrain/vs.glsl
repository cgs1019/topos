attribute highp vec2 texture_coord;
attribute highp vec3 vertex_coord;

uniform highp mat4 position_matrix;
uniform highp mat4 transformation_matrix;
uniform highp mat4 perspective_matrix;

varying highp vec2 v_texture_coord;

void main(void) {
  gl_Position = (
      perspective_matrix *
      position_matrix *
      transformation_matrix *
      vec4(vertex_coord, 1.0));

  v_texture_coord = texture_coord;
}

