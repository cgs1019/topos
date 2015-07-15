varying highp vec2 v_texture_coord;
varying highp vec4 v_normal;

uniform highp vec3 directional_light;
uniform sampler2D u_sampler;

uniform bool use_lighting;

void main(void) {
  highp float p = 0.0;
  highp float light_weighting =
      p + (1.0 - p) * max(dot(vec3(v_normal), directional_light), 0.0);

  highp vec4 texel_color = texture2D(
      u_sampler, vec2(v_texture_coord.s, v_texture_coord.t));
  gl_FragColor = vec4(texel_color.rgb * light_weighting, texel_color.a);
}
