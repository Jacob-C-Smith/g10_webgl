class Renderer {

    constructor ()
    {
        this.name = "";
        this.pipelines = { };
        this.attachments = { };
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

        // construct attachments
        {

            // iterate through each attachment
            for (let i = 0; i < value.attachments.length; i++) {

                // initialized data
                let attachment = await Attachment.fromJson(value.attachments[i]);

                // add the attachment
                renderer.attachments[attachment.name] = attachment;
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

    // draw a frame
    draw(){

        // clear the viewport
        gl.clearColor(0.0, 0.0, 0.0, 0.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        // iterate through each render pass
        for (let i = 0; i < this.passes.length; i++) {

            // initialized data
            let render_pass = this.passes[i];

            // execute the render pass
            render_pass.draw(this);
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