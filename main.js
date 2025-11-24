let eye = [ -2, 0, 0 ];
let degre = 0;

let instance = null;

gl = null;

/**
 * Early initialization
 */
function init ( ) 
{

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
    gl.clearColor(...gl.framebufferClearColor);

    // viewport
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    
    // done
}

async function programShaders ( )
{

    // initialized data
    let colorEntityPipeline = Instance.getPipeline("color entity");
    let depthEntityPipeline = Instance.getPipeline("depth entity");

    // set bind once
    colorEntityPipeline.setBindOnce((pipeline) => {
        
        // enable the vertex buffer
        gl.enableVertexAttribArray(0);  

        {
            let p = mat4.create();
            let v = mat4.create();

            mat4.perspective(90, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, p);
            mat4.lookAt(eye, [0,0,0], [0,0,1], v)
            
            eye[2] = Math.sin(degre);
            degre += 0.02;

            gl.uniformMatrix4fv(pipeline.uniforms.P, false, p);
            gl.uniformMatrix4fv(pipeline.uniforms.V, false, v);
        }
    })

    // set bind each
    colorEntityPipeline.setBindEach((pipeline, drawable) => {
        drawable.transform.rotation[0] += 0.01;
    })

    // set bind once
    depthEntityPipeline.setBindOnce((pipeline) => {

        // enable the vertex buffer
        gl.enableVertexAttribArray(0);
    })

    // set bind each
    depthEntityPipeline.setBindEach((pipeline, drawable) => {})

    // done
    return;
}

/** 
 * Entry point
 */
async function main()
{

    // initialize
    init(); 

    // load the instance
    instance = await Instance.load("static/assets/instance.json")

    // program the shaders
    await programShaders();
    
    // draw the scene
    requestAnimationFrame(draw);
}

function draw (t)
{

    // draw the scene
    instance.renderer.draw();

    // next frame
    requestAnimationFrame(draw);
}
