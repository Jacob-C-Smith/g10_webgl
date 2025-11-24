class Pipeline {

    constructor()
    {
        this.name = "";
        this.shader = null;
        this.vertexAttributes = null;
        this.uniforms = null;
        this.drawList = null;
        this.bindOnceFunc = null;
        this.bindEachFunc = null;
    }

    static async fromJson(value, bindOnce, bindEach)
    {

        // initialized data
        let pipeline = new Pipeline();
        let shaderSource = value.source;
        let vertexAttributes = value.attributes;
        let uniforms = value.uniforms;

        // store the name
        pipeline.name = value.name;

        // construct the shader
        pipeline.shader = await Shader.fromJson(shaderSource)

        // use the shader
        pipeline.shader.use()

        // construct vertex attributes
        {

            // initialized data
            let prog = pipeline.shader.prog;

            // construct a dictionary of vertex attributes
            pipeline.vertexAttributes = {};

            // iterate through each vertex attribute
            for (const [k, v] of Object.entries(vertexAttributes))
            {

                // initialized data
                let iVertexAttr = gl.getAttribLocation(prog, k);

                // enable the vertex attribute
                gl.enableVertexAttribArray(iVertexAttr);

                // store the vertex attribute and its location
                pipeline.vertexAttributes[k] = iVertexAttr;
            }
        }

        // construct uniforms
        {

            // construct a dictionary of vertex attributes
            pipeline.uniforms = {};

            // iterate through each uniform
            for (const [k, v] of Object.entries(uniforms))
            {
                
                // store the uniform location
                pipeline.uniforms[k] = gl.getUniformLocation(pipeline.shader.prog, k);
            }
        }
        
        // construct a draw list
        pipeline.drawList = [ ];

        // store the bind functions
        pipeline.bindOnceFunc = bindOnce;
        pipeline.bindEachFunc = bindEach;

        // success
        return pipeline;
    }

    static async load(uri, bindOnce, bindEach)
    {

        // success
        return await Pipeline.fromJson(
            await fetchJson(uri),
            bindOnce,
            bindEach
        );
    }

    add(d)
    {
        this.drawList.push(d);
    }

    bindOnce()
    {
        this.shader.use();
        this.bindOnceFunc(this);
    }

    setBindOnce(bindOnce){
        this.bindOnceFunc = bindOnce;
    }

    bindEach(g)
    {
        this.bindEachFunc(this, g)
        g.bind(this)
    }

    setBindEach(bindEach){
        this.bindEachFunc = bindEach;
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