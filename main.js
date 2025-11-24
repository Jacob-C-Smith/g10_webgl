let eye = [ -0.5, 0, 0.00 ];
let degre = 0;

let tex = null;

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
        gl = canvas.getContext("webgl2", { alpha: true }) ||
             canvas.getContext("webgl") || 
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
    let textureEntityPipeline = Instance.getPipeline("texture entity");

    // set bind once
    colorEntityPipeline.setBindOnce((pipeline) => {

        // initialized data
        let p = mat4.create();
        let v = mat4.create();

        // compute P
        mat4.perspective(90, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, p);
        gl.uniformMatrix4fv(pipeline.uniforms.P, false, p);
        
        // compute V
        mat4.lookAt(eye, eye, [0,0,1], v)
        gl.uniformMatrix4fv(pipeline.uniforms.V, false, v);
    })

    // set bind each
    colorEntityPipeline.setBindEach((pipeline, drawable) => {

        // bind the entity
        drawable.bind(pipeline)

        // bind the color
        gl.uniform3f(pipeline.uniforms.color, ...drawable.color);

        // set the transform
        drawable.transform.rotation[0] += 0.01;
    })

    // set bind once
    depthEntityPipeline.setBindOnce((pipeline) => { })

    // set bind each
    depthEntityPipeline.setBindEach((pipeline, drawable) => { })

    // set bind once
    textureEntityPipeline.setBindOnce((pipeline) => {

        // initialized data
        let p = mat4.create();
        let v = mat4.create();

        // in 0 -> xyz
        // in 1 -> uv
        gl.enableVertexAttribArray(0);  
        gl.enableVertexAttribArray(1);  

        // compute P
        mat4.perspective(90, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, p);
        gl.uniformMatrix4fv(pipeline.uniforms.P, false, p);

        // compute V
        mat4.lookAt(eye, eye, [0,0,1], v)
        gl.uniformMatrix4fv(pipeline.uniforms.V, false, v);
    })

    // set bind each
    textureEntityPipeline.setBindEach((pipeline, drawable) => {
        
        // bind the entity
        drawable.bind(pipeline)

        // bind the texture
        drawable.texture.bind(pipeline)
    })

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
    instance = await Instance.load("static/assets/instance.json");

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
