varying highp vec2 v_texture_coord;
varying highp vec3 v_light_weighting;

uniform sampler2D u_sampler;

void main(void) {
  highp vec4 texel_color = texture2D(
      u_sampler, vec2(v_texture_coord.s, v_texture_coord.t));
  gl_FragColor = vec4(texel_color.rgb * v_light_weighting, texel_color.a);
}
