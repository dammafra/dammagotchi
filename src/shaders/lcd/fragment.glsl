uniform sampler2D uMap;
uniform float uContrastFactor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;

void main() {
  vec3 screenColor = texture2D(uMap, vUv).rgb;

  /**
    dot(vNormal, vViewDir)

    This computes the dot product between the normal of the surface (vNormal) and the view direction
    (vViewDir). The dot product returns a value between -1 and 1, which represents the angle
    between the two vectors. A value close to 1 means the camera is looking directly at the
    screen (front view), a value close to -1 means the camera is completely tilted away from
    the surface.

    max(dot(vNormal, vViewDir), 0.2)

    By using max(., 0.2), we ensure that the view angle is never below 0.2. This prevents the
    contrast from becoming too intense or the image from going completely black when the camera is
    excessively tilted.
  */
  float viewAngle = max(dot(vNormal, vViewDir), 0.2);

  /**
  pow(viewAngle, uContrastFactor)

  This raises the view angle (viewAngle) to the power of uContrastFactor (this parameter allows you
  to adjust the intensity of the effect). If uContrastFactor is low (e.g., 1), the contrast
  variation will be smoother. If it’s higher (e.g., 3), the effect will be more pronounced.

  Blends two values:
  - 0.5 (minimum contrast, dark, when the surface is tilted)
  - 1.2 (maximum contrast, bright, when the surface is viewed head-on)
  */
  float adjustedContrast = mix(0.5, 1.5, pow(viewAngle, uContrastFactor));

  vec3 lcdFinalColor = screenColor * adjustedContrast;
  gl_FragColor = vec4(lcdFinalColor, 1.0);
}