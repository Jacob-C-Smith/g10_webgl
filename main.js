let eye = [ -0.5, 0, 0.00 ];
let degre = 0;
let idx = 0;
let lastTime = 0;
let totalTime = 0;

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
    let uvEntityPipeline = Instance.getPipeline("uv entity");
    let textureEntityPipeline = Instance.getPipeline("texture entity");
    let tilemapEntityPipeline = Instance.getPipeline("tilemap entity");
    
    // set bind once
    colorEntityPipeline.setBindOnce((pipeline) => {

        // initialized data
        let camera = Instance.scene.activeCamera;

        // bind the camera
        camera.bind(pipeline);
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
    uvEntityPipeline.setBindOnce((pipeline) => {

        // initialized data
        let camera = Instance.scene.activeCamera;

        // bind the camera
        camera.bind(pipeline);
    });

    // set bind each
    uvEntityPipeline.setBindEach((pipeline, drawable) => {
        
        // bind the entity
        drawable.bind(pipeline)
    });

    // set bind once
    textureEntityPipeline.setBindOnce((pipeline) => {

        // initialized data
        let camera = Instance.scene.activeCamera;

        // bind the camera
        camera.bind(pipeline);
    });

    // set bind each
    textureEntityPipeline.setBindEach((pipeline, drawable) => {
        
        // bind the entity
        drawable.bind(pipeline)

        // bind the texture
        drawable.texture.bind(pipeline, 'sampler')
    });

    // set bind once
    tilemapEntityPipeline.setBindOnce((pipeline) => {

        // initialized data
        let camera = Instance.scene.activeCamera;

        // bind the camera
        camera.bind(pipeline);
    });

    // set bind each
    tilemapEntityPipeline.setBindEach((pipeline, drawable) => {
        
        // bind the entity
        drawable.bind(pipeline)

        // width
        gl.uniform1i(pipeline.uniforms.width, 8);

        // height
        gl.uniform1i(pipeline.uniforms.height, 16);

        // index
        gl.uniform1i(pipeline.uniforms.index, 4+(totalTime/125)%4);

        // bind the texture
        drawable.texture.bind(pipeline, 'sampler')
    });

    // done
    return;
}

async function programRenderer ( )
{
    let renderer = Instance.renderer;
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

    // game logic
    //
    
    // draw the scene
    draw();
}

function animate() {
    let timeNow = new Date().getTime();
    if (lastTime != 0) {
        let elapsed = timeNow - lastTime;
        totalTime += elapsed;

        let e1 = Instance.scene.entities[2];
        let lr = Instance.getBind("RUN RIGHT") - Instance.getBind("RUN LEFT");


        e1.transform.location[0] += vel = elapsed/1000 * lr;
    }
    lastTime = timeNow;
}

function draw (t)
{

    // next frame
    requestAnimationFrame(draw);

    // draw the scene
    instance.renderer.draw();

    // animate
    animate();
}
