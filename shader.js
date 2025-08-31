class Shader {

    constructor() {
        this.name = "",
        this.vertSource = null,
        this.fragSource = null,
        this.prog = null;
    }

    static async fromJson(value){

        // initialized data
        let shader = new Shader();

        // store the sources
        shader.vertSource = await fetchText(value["vert"]);
        shader.fragSource = await fetchText(value["frag"]);

        // compile the shader source
        {

            // construct the shader 
            shader.prog = gl.createProgram();

            // attach the binaries
            gl.attachShader(
                shader.prog, 
                compileShader(
                    gl, 
                    shader.vertSource, 
                    gl.VERTEX_SHADER
                )
            );
            gl.attachShader(
                shader.prog, 
                compileShader(
                    gl, 
                    shader.fragSource, 
                    gl.FRAGMENT_SHADER
                )
            );

            // link the shader
            gl.linkProgram(shader.prog);

            // error check
            if (!gl.getProgramParameter(shader.prog, gl.LINK_STATUS)) 
                throw new Error("[shader] Could not initialise shaders");
        }

        // success
        return shader;
    }

    static async load(uri) {

        // success
        return await Shader.fromJson(
            await fetchJson(uri)
        );
    }

    use()
    {

        // NOTE: result -> undefined
        gl.useProgram(this.prog);
    }

    str()
    {
        return `
        {
            name         : ${this.name},
            source       : 
            {
                vert: "
${this.vertSource}
                ",
                frag: "
${this.fragSource}
                "
            }
        }
        `
    }
}