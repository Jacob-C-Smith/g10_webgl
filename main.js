let geometryPaths =
[
    "geometry/tri1.json",
    "geometry/tri2.json",
    "geometry/tri3.json"
]

let colorEntityPipeline;
let depthEntityPipeline;
let transformDebugPipeline;

let pass = [ ];
let geometries = { };

let eye = [ -2, 0, 0 ];
let degre = 0;

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
    gl.clearColor(...gl.framebufferClearColor);

    // viewport
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    
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

async function loadShadersAsync ( )
{

    colorEntityPipeline = await Pipeline.load(
        "shader/color_entity.json",
        (pipeline) => {
            console.log(`[pipeline] [bind] ${pipeline.name}`);

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
        },
        (pipeline, drawable) => {
            console.log(`[drawable] [bind] ${drawable.name}`);
            
            drawable.transform.rotation[0] += 0.01;
        }
    )

    depthEntityPipeline = await Pipeline.load(
        "shader/depth_entity.json",
        (pipeline) => {
            console.log(`[pipeline] [bind] ${pipeline.name}`);

            // enable the vertex buffer
            gl.enableVertexAttribArray(0);    

        },
        (pipeline, drawable) => {
            console.log(`[drawable] [bind] ${drawable.name}`);
        }
    )

    transformDebugPipeline = await Pipeline.load(
        "shader/transform_debug.json",
        (pipeline) => {
            console.log(`[pipeline] [bind] ${pipeline.name}`);

            // disable the vertex buffer
            gl.disableVertexAttribArray(0);    
            
            // set a constant 0
            gl.vertexAttrib3f(0, 0.0, 0.0, 0.0);
        },
        (pipeline, drawable) => {
            console.log(`[drawable] [bind] transform`);
        }
    )

    // done
    return;
}

async function loadGeometriesAsync ( )
{

    // initialized data
    let promises = []
    let results = null;

    // load geometries
    for (const path of geometryPaths) 
        promises.push(
            Geometry.load(path)
        );

    // wait for all geometries to load
    results = await Promise.all(promises);

    // Add the loaded geometries to the list
    for (const g of results) 
        geometries[g.name] = g;

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

    // load
    {

        // load pipelines
        await loadShadersAsync();

        // load geometries
        await loadGeometriesAsync();
    }
    
    // setup
    {

        // load an entity
        e1 = await Entity.load("entity/t1.json");
        e2 = await Entity.load("entity/t2.json");

        // add the triangle to the draw list
        colorEntityPipeline.add(e1);
        colorEntityPipeline.add(e2);
        // transformDebugPipeline.add(e1.transform);
        // transformDebugPipeline.add(e2.transform);

        // add the pipelines to the render pass
        pass.push(colorEntityPipeline);
        pass.push(colorEntityPipeline);
        pass.push(transformDebugPipeline);
    }

    // draw the scene
    requestAnimationFrame(drawScene);
}

function drawScene ( t )
{

    // clear the viewport
    gl.clear(gl.COLOR_BUFFER_BIT);

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

    requestAnimationFrame(drawScene);
}
