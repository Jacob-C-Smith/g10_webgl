let triangle1Geometry;
let triangle2Geometry;

let pitchWhitePipeline;
let colorPipeline;

let pass = [ ];

gl = null;

function init () {

    // initialized data
    let canvas = document.getElementById('hellowebgl');
    
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

    // set the viewport
    gl.viewportWidth = canvas.width,
    gl.viewportHeight = canvas.height;

    // set the backface cull
    gl.polygonCull = true,
    gl.polygonCullFace = gl.FRONT_AND_BACK;

    // clear the color attachment with black
    gl.framebufferClearColor = [ 0.0, 0.0, 0.0, 1.0 ];

    // viewport
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    // done
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

async function loadShadersAsync() {

    // load the pipeline
    pitchWhitePipeline = await Pipeline.load(
        "shader/pitch_white.json",
        (x) => {
            console.log(`once ${x}`)
        },
        (y) => {
            console.log(`each ${y}`)
        }
    )
    
    colorPipeline = await Pipeline.load(
        "shader/color.json",
        (x) => {
            console.log(`once ${x}`)
        },
        (y) => {
            console.log(`each ${y}`)
        }
    )

    // shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
    // shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');

    // done
    return;
}

async function loadGeometriesAsync() {

    // load the triangle
    triangle1Geometry = await Drawable.load(
        "geometry/tri1.json", 
        (loadedGeometry) => {triangle1Geometry = loadedGeometry;}
    )

    // load the triangle
    triangle2Geometry = await Drawable.load(
        "geometry/tri2.json", 
        (loadedGeometry) => {triangle2Geometry = loadedGeometry;}
    )

    // done
    return;
}

/** 
 * Entry point
 */
async function main() {

    // initialize
    init(); 

    // load
    {
        
        // load pipelines
        await loadShadersAsync();

        // load geometries
        await loadGeometriesAsync();
    }
    
    // setup
    {

        // add the triangle to the draw list
        pitchWhitePipeline.add(triangle1Geometry);
        colorPipeline.add(triangle2Geometry);

        // add the pipelines to the render pass
        pass.push(pitchWhitePipeline);
        pass.push(colorPipeline);
    }

    // draw the scene
    drawScene();
}

function drawScene()
{

    // clear the viewport
    gl.clearColor(...gl.framebufferClearColor);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // iterate through each pipeline in the render pass
    for (let p of pass)
    {

        // bind the pipeline
        p.bindOnce();

        // draw each item in the pipeline
        for (let g of p.drawList)
        {

            // bind the drawable
            p.bindEach(g);

            // draw the drawable
            g.draw();
        }
    }
}
