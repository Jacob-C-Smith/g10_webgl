class Uniform {

    constructor (shader, name)
    {

        // store the shader
        this.shader = shader

        // store the name
        this.name = name

        // store the uniform location
        this.uniform = gl.getUniformLocation(
            this.shader,
            name
        )

        // error check
        if ( null == this.uniform )
            throw new Error(`[shader] [uniform] Uniform \"${this.name}\" not found`)
    }

    bind(value) { 
        throw new Error("bind method not implemented!")
    }
}