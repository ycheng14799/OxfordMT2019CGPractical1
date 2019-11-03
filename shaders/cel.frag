uniform vec3 lightPos;
uniform vec3 color;
uniform float numDiffuseTones;
uniform float coolToWarmStrength;
uniform vec3 coolColor;
uniform vec3 warmColor;
uniform float diffuseStrength;
uniform vec3 viewPos;
uniform float specularStrength;
uniform float phongExponent;
uniform float numSpecularTones;
uniform float outlineThreshold;
uniform float ambientStrength;

varying vec3 world_normal;
varying vec3 fragPos;

void main() {
  vec3 ambient = ambientStrength * color;

  vec3 lightDir = normalize(lightPos - fragPos);
  float warmthConstant =
    floor(max(0.0, dot(lightDir, world_normal)) * numDiffuseTones)
    / numDiffuseTones;
  vec3 coolToWarmDiffuse = coolToWarmStrength * (warmthConstant * warmColor +
    (1.0 - warmthConstant) * coolColor);
  vec3 diffuse = diffuseStrength * (warmthConstant * color);

  vec3 viewDir = normalize(viewPos - fragPos);
  vec3 reflection =
    normalize(2.0 * dot(normalize(world_normal), normalize(lightPos - fragPos))
    * normalize(world_normal) - normalize(lightPos - fragPos));
  float discreteSpecular =
    floor(pow(max(0.0, dot(reflection, viewDir)), phongExponent)
      * numSpecularTones) / numSpecularTones;
  vec3 specular = specularStrength
    * discreteSpecular
    * color;

  float outline = step(outlineThreshold, dot(viewDir, world_normal));

  vec3 result = outline * (ambient + diffuse + coolToWarmDiffuse + specular);

  gl_FragColor = vec4(result, 1.0);
}
