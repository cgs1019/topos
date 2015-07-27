varying highp vec2 v_texture_coord;
uniform sampler2D u_sampler;

void main(void) {
  gl_FragColor = texture2D(
      u_sampler, vec2(v_texture_coord.s, v_texture_coord.t));
}
