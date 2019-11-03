uniform vec3 color;
uniform vec3 viewPos;

varying vec3 world_normal;
varying vec3 fragPos;

void main() {
  vec3 viewDir = normalize(viewPos - fragPos);
  vec3 result = step(0.25, dot(viewDir, normalize(world_normal)))
    * color;
  gl_FragColor = vec4(result, 1.0);
}
