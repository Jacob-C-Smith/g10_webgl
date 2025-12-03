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
                if ( iVertexAttr !== -1 ) gl.enableVertexAttribArray(iVertexAttr);

                // store the vertex attribute and its location
                v.location = iVertexAttr;
                pipeline.vertexAttributes[k] = v;
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

        // add draw item d to the draw list
        this.drawList.push(d);
    }

    bindOnce()
    {

        // bind this shader
        this.shader.use();

        // set vertex attributes
        for (const [k, v] of Object.entries(this.vertexAttributes)) {

            // enable the attribute
            if ( v.location !== -1 ) gl.enableVertexAttribArray(v.location);
        }

        // double dispatch
        this.bindOnceFunc(this);
    }

    setBindOnce(bindOnce){

        // set the bind once function
        this.bindOnceFunc = bindOnce;
    }

    bindEach(g)
    {

        // double dispatch each function
        this.bindEachFunc(this, g)

        // bind the draw object
        g.bind(this)
    }

    setBindEach(bindEach){

        // set the bind each function
        this.bindEachFunc = bindEach;
    }

    str()
    {

        // done 
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