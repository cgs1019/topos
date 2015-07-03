attribute highp vec2 texture_coord;
attribute highp vec3 vertex_coord;
attribute highp vec3 normal;

uniform vec3 directional_light;

uniform highp mat4 position_matrix;
uniform highp mat4 transformation_matrix;
uniform highp mat4 perspective_matrix;

uniform bool use_lighting;

varying highp vec2 v_texture_coord;
varying highp vec3 v_light_weighting;

void main(void) {
  gl_Position = (
      perspective_matrix *
      position_matrix *
      transformation_matrix *
      vec4(vertex_coord, 1.0));

  v_texture_coord = texture_coord;

  if (!use_lighting) {
      v_light_weighting = vec3(1.0, 1.0, 1.0);
  } else {
      float light_weighting =
          max(dot(normal, directional_light), 0.0);
      v_light_weighting = vec3(1.0, 1.0, 1.0) * light_weighting;
  }
}
