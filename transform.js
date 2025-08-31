class Transform extends Uniform
{
    constructor(shader, name, m)
    {
        super(shader, name)
        this.m = m;
    }

    bind() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    }
}