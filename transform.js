class Transform extends Uniform
{
    constructor ( )
    {
        super()
        this.location = null;
        this.rotation = null;
        this.scale = null;
        this.modelMatrix = mat4.create();
    }

    static async fromJson (value)
    {

        // initialized data
        let transform = new Transform();

        // store the transform
        transform.location = value.location;
        transform.rotation = value.rotation;
        transform.scale = value.scale;

        // construct a matrix
        transform.modelMatrix = mat4.create();

        // compute the model matrix
        transform.computeModel();

        // done
        return transform;
    }

    computeModel ( )
    {

        // 1
        mat4.identity(this.modelMatrix);

        // location
        mat4.translate(this.modelMatrix, this.location);
        
        // scale
        mat4.scale(this.modelMatrix, this.scale);

        // rotation
        mat4.rotate(this.modelMatrix, this.rotation[0], [1, 0, 0]);
        mat4.rotate(this.modelMatrix, this.rotation[1], [0, 1, 0]);
        mat4.rotate(this.modelMatrix, this.rotation[2], [0, 0, 1]);

        // done
    }

    // bind the transform
    bind ( pipeline )
    {

        // compute the model matrix
        this.computeModel()

        // set the model matrix
        gl.uniformMatrix4fv(pipeline.uniforms.M, false, this.modelMatrix);
    }

    draw ( )
    {

        // draw a point
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}