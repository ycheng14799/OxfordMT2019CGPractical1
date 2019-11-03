varying vec3 world_normal;
varying vec3 fragPos;
void main() {
  world_normal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  fragPos = vec3(gl_Position.x, gl_Position.y, gl_Position.z);
}
