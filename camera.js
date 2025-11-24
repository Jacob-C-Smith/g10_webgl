class Camera {

    constructor ()
    {
        this.name = "";
        this.transform = null;
        this.geometry = null;
    }

    // load the geometry from a JSON value
    static async fromJson(value)
    {
        
        // initialized data
        let camera = new Camera();

        // construct the camera
        camera.name = value.name;

        // done
        return camera;
    }

    // load the camera from a JSON file
    static async load (uri)
    {

        // success
        return await Camera.fromJson(
            await fetchJson(uri)
        );
    }

    // bind the camera
    bind (pipeline)
    {

        // bind the transform
        this.transform.bind(pipeline);
        
        // bind the color
        gl.uniform3f(pipeline.uniforms.color, ...this.color);

        // bind the geometry
        this.geometry.bind(pipeline);
    }

    // draw the camera
    draw ( )
    {

        // draw the camera
        this.geometry.draw();
    }

    // create a textual representation of the camera
    str ( )
    {
        return `
        {
            name         : ${this.name},
            geometry     : ${this.geometry.str()}
        }
        `
    }
}
