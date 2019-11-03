uniform vec3 color;
uniform vec3 lightPos;
uniform vec3 lightColor;
uniform float ambientStrength;
uniform float diffuseStrength;
uniform float specularStrength;
uniform float phongExponent;
uniform vec3 viewPos;

varying vec3 world_normal;
varying vec3 fragPos;

void main() {
  vec3 ambient = ambientStrength * lightColor;
  vec3 diffuse = diffuseStrength
    * max(0.0, dot(normalize(world_normal), normalize(lightPos - fragPos)))
    * lightColor;
  vec3 reflection =
    normalize(2.0 * dot(normalize(world_normal), normalize(lightPos - fragPos))
    * normalize(world_normal) - normalize(lightPos - fragPos));
  vec3 viewDir = normalize(viewPos - fragPos);
  vec3 specular = specularStrength
    * pow(max(0.0, dot(reflection, viewDir)), phongExponent)
    * lightColor;
  vec3 result = color * (ambient + diffuse + specular);
  gl_FragColor = vec4(result,1.0);
}
