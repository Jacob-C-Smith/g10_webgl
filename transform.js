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
        mat4.identity(transform.modelMatrix);

        mat4.translate(transform.modelMatrix, transform.location);
        mat4.rotate(transform.modelMatrix, transform.rotation[0], [1, 0, 0]);
        mat4.rotate(transform.modelMatrix, transform.rotation[1], [0, 1, 0]);
        mat4.rotate(transform.modelMatrix, transform.rotation[2], [0, 0, 1]);
        mat4.scale(transform.modelMatrix, transform.scale);

        return transform;
    }

    bind ( )
    {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    }
}