class Camera {

    constructor ()
    {
        this.name = "";
        this.view = null;
        this.projection = null;
        this.fov = null;
        this.nearClip = null;
        this.farClip = null;
        this.up = null;
        this.target = null;
        this.location = null;
    }

    // load the geometry from a JSON value
    static async fromJson(value)
    {
        
        // initialized data
        let camera = new Camera();

        // construct the camera
        camera.name = value.name;

        // store the fov
        camera.fov = value.fov;

        // store the clipping planes
        camera.nearClip = value.clip[0];
        camera.farClip = value.clip[1];

        // store the up vector
        camera.up = value.up;

        // store the target vector
        camera.target = value.target;

        // store the location vector
        camera.location = value.location;

        // construct the projection matrix
        camera.projection = mat4.create();
        
        // compute the projection matrix
        mat4.perspective(camera.fov, gl.viewportWidth / gl.viewportHeight, camera.nearClip, camera.farClip, camera.projection);

        // construct the view matrix
        camera.view = mat4.create();
        
        // compute the view matrix
        mat4.lookAt(camera.location, camera.target, camera.up, camera.view)

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

        // compute the projection matrix
        mat4.perspective(this.fov, gl.viewportWidth / gl.viewportHeight, this.nearClip, this.farClip, this.projection);

        // compute the view matrix
        mat4.lookAt(this.location, this.target, this.up, this.view)

        // bind the projection matrix
        gl.uniformMatrix4fv(pipeline.uniforms.P, false, this.projection);

        // bind the view matrix
        gl.uniformMatrix4fv(pipeline.uniforms.V, false, this.view);
    }

    // create a textual representation of the camera
    str ( )
    {
        return `
        {
            name : ${this.name}
        }
        `
    }
}
