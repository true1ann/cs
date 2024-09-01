// Define WebGL-related variables in a broader scope
let gl, program, vertexShader, fragmentShader, positionBuffer;

async function fetchShader(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch shader: ${response.statusText}`);
    }
    return await response.text();
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    }

    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program;
    }

    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

async function init() {
    // Set styles for html and body to remove margin and padding
    $('html, body').css({
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        width: '100%',
        height: '100%'
    });

    const canvas = $('<canvas></canvas>').appendTo('body')[0];
    gl = canvas.getContext('webgl'); // Assign to the global variable

    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    // Set the canvas size to fill the entire window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Fetch and compile shaders
    const vertexShaderSource = `
        attribute vec4 a_position;
        void main() {
            gl_Position = a_position;
        }
    `;

    const fragmentShaderSource = await fetchShader('/ogl/test.glsl');

    vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource); // Assign to the global variable
    fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource); // Assign to the global variable
    program = createProgram(gl, vertexShader, fragmentShader); // Assign to the global variable

    // Get the location of the uniform variables
    const uWidthLocation = gl.getUniformLocation(program, 'u_width');
    const uHeightLocation = gl.getUniformLocation(program, 'u_height');

    // Set the uniform values
    gl.useProgram(program);
    gl.uniform1f(uWidthLocation, canvas.width);  // Set the width
    gl.uniform1f(uHeightLocation, canvas.height); // Set the height

    // Create a buffer and put a single clip space rectangle in
    positionBuffer = gl.createBuffer(); // Assign to the global variable
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
         1,  1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Render loop
    function render() {
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        const positionLocation = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(render);
    }

    render();
}

// Initialize the application
init().catch(console.error);
