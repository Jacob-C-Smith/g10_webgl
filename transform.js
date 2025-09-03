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

        transform.location = value.location;
        transform.rotation = value.rotation;
        transform.scale = value.scale;

        transform.modelMatrix = mat4.create();

        transform.computeModel();

        return transform;
    }

    computeModel ( )
    {
        mat4.identity(this.modelMatrix);

        mat4.translate(this.modelMatrix, this.location);
        
        mat4.scale(this.modelMatrix, this.scale);

        mat4.rotate(this.modelMatrix, this.rotation[0], [1, 0, 0]);
        mat4.rotate(this.modelMatrix, this.rotation[1], [0, 1, 0]);
        mat4.rotate(this.modelMatrix, this.rotation[2], [0, 0, 1]);
    }

    bind ( pipeline )
    {
        this.computeModel()
        gl.uniformMatrix4fv(pipeline.uniforms.M, false, this.modelMatrix);
    }

    draw ( )
    {
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}