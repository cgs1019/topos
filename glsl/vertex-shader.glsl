attribute highp vec2 texture_coord;
attribute highp vec3 vertex_coord;
attribute highp vec3 normal;

uniform highp vec3 directional_light;

uniform highp mat4 position_matrix;
uniform highp mat4 transformation_matrix;
uniform highp mat4 perspective_matrix;

uniform bool use_lighting;

varying highp vec2 v_texture_coord;
varying highp vec4 v_normal;

void main(void) {
  gl_Position = (
      perspective_matrix *
      position_matrix *
      transformation_matrix *
      vec4(vertex_coord, 1.0));

  v_texture_coord = texture_coord;

  if (!use_lighting) {
    v_normal = vec4(directional_light, 1.0);
  } else {
    v_normal = transformation_matrix * vec4(normal, 1.0);
  }
}
