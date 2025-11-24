class Renderer {

    constructor ()
    {
        this.name = "";
        this.pipelines = { };
        this.passes = [ ];
    }

    // load the renderer from a JSON value
    static async fromJson(value)
    {
        
        // initialized data
        let renderer = new Renderer();

        // construct the renderer
        renderer.name = value.name;

        // construct pipelines
        {

            // iterate through each pipeline
            for (const [k, v] of Object.entries(value.pipelines))
            {

                // store the uniform location
                renderer.pipelines[k] = await Pipeline.load(v, null, null);

                // cache the pipeline
                Instance.setPipeline(k, renderer.pipelines[k]);
                
                // log the load
                console.log(`loaded ${renderer.pipelines[k]}`);
            }
        }

        // construct render passes
        {

            // iterate through each render pass
            for (let i = 0; i < value.passes.length; i++) {

                // initialized data
                let render_pass = await RenderPass.fromJson(value.passes[i]);

                // add the render pass
                renderer.passes.push(render_pass);

                // log the load
                console.log(`loaded ${render_pass}`);
            }
        }

        // done
        return renderer;
    }

    // load the renderer from a JSON file
    static async load (uri)
    {

        // success
        return await Renderer.fromJson(
            await fetchJson(uri)
        );
    }

    draw(){

        // clear the viewport
        gl.clear(gl.COLOR_BUFFER_BIT);


        // iterate through each render pass
        for (let i = 0; i < this.passes.length; i++) {

            // initialized data
            let render_pass = this.passes[i];

            render_pass.draw(this);

            console.log(render_pass);
        }
    }

    // create a textual representation of the renderer
    str ( )
    {
        return `
        {
            name : ${this.name},
        }
        `
    }
}