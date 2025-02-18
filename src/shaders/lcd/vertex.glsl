varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(cameraPosition - position);
}
