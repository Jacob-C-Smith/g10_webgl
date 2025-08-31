let shaderProgram;
let mvMatrix = mat4.create();
let pMatrix = mat4.create();
let triangleVertexPositionBuffer;
let squareVertexPositionBuffer;

let triangleGeometry;
let pitchWhitePipeline;

gl = null;

function initWebGLContext ( aname ) {

    // initialized data
    let canvas = document.getElementById(aname);
    
    // get a gl context
    try 
    {
        gl = canvas.getContext("webgl") || 
             canvas.getContext("experimental-webgl");
    }
    catch (e)
    {
        console.error("Error initializing WebGL:", e);
    }

    // error check
    if (!gl) 
    {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        gl = null;
    }

    // global state
    {

        // set the viewport
        {
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        }

        // set the backface cull
        {
            gl.polygonCull = true;
            gl.polygonCullFace = gl.FRONT_AND_BACK;
        }

    }

    // framebuffers
    {

        // clear the color attachment with red
        gl.framebufferClearColor = [ 1.0, 0.0, 0.0, 1.0 ];
    }

    // viewport
    {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    }

    // done
    return gl;
}

// define the function to initial WebGL and Setup Geometry Objects
function initGLScene()
{
    // Initialize the WebGL Context - the gl engine for drawing things.
    let gl = initWebGLContext("hellowebgl"); // The id of the Canvas Element
    
    // error check
    if (!gl) return;

    // succeeded in initializing WebGL system
    return gl;     
}

function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

async function initShadersAsync(gl) {
    const fragSource = await fetchText('shader/pitch_white/frag');
    const vertSource = await fetchText('shader/pitch_white/vert');
    const fragmentShader = compileShader(gl, fragSource, gl.FRAGMENT_SHADER);
    const vertexShader = compileShader(gl, vertSource, gl.VERTEX_SHADER);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Could not initialise shaders');
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
}

function initShaders()
{
    let fragmentShader = getShader(gl, "shader-fs");
    let vertexShader = getShader(gl, "shader-vs");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function setMatrixUniforms()
{
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

// create and initialize our geometry objects
function initGeometry() {
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);

            var vertices = [
                0.0,  1.0,  0.0,
                -1.0, -1.0,  0.0,
                1.0, -1.0,  0.0
            ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 3;

    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    vertices = [
                1.0,  1.0,  0.0,
                -1.0,  1.0,  0.0,
                1.0, -1.0,  0.0,
                -1.0, -1.0,  0.0
            ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4;
}

function initTextures()
{
}

//Initialize everything for starting up a simple webGL application
async function startHelloWebGL() {
    
    // initialized data
    let gl = initGLScene();

    // error check
    if (!gl) return;

    // now build basic geometry objects.
    await initShadersAsync(gl);

    pitchWhitePipeline = await Pipeline.load(
        "shader/pitch_white.json"
    )
    console.log(pitchWhitePipeline.str())

    triangleGeometry = await Drawable.load(
        "geometry/triangle.json", 
        (loadedGeometry) => {triangleGeometry = loadedGeometry;}
    )
    console.log(triangleGeometry.str());

    initGeometry();
    initTextures();

    // draw the scene
    drawScene(gl);

    // If doing an animation need to add code to rotate our geometry
}

// This function draws a basic webGL scene
// first it clears the framebuffer.
// then we define our View positions for our camera using WebGL matrices.
// OpenGL has convenience methods for this such as glPerspective().
// finally we call the gl draw methods to draw our defined geometry objects.
function drawScene(gl)
{

    // clear the viewport
    gl.clearColor(
        gl.framebufferClearColor[0],
        gl.framebufferClearColor[1],
        gl.framebufferClearColor[2],
        gl.framebufferClearColor[3],
    );
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // initialize a Perspective Projection view position.
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);
    
    // translate the view a bit and draw the Big Translate.
    mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    // gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
    triangleGeometry.draw()


    // translate the model view matrix and draw the Big Square
    mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
}