// Use GLSL ES 1.00
precision mediump float;

// Declare uniform variables for width and height
uniform float u_width;
uniform float u_height;

void main() {
    // Define the gradient colors
    vec3 color1 = vec3(0.0, 0.5, 1.0); // Blue
    vec3 color2 = vec3(1.0, 0.5, 0.0); // Orange

    // Calculate the gradient based on the fragment's position
    float gradient = gl_FragCoord.y / u_height; // Use the uniform height

    // Interpolate between the two colors
    vec3 color = mix(color1, color2, gradient);

    // Set the output color
    gl_FragColor = vec4(color, 1.0);
}
