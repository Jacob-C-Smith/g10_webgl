class RenderPass {

    constructor ()
    {
        this.name = "";
        this.attachments = [ ];
        this.pipelines = [ ];
    }

    // load the render pass from a JSON value
    static async fromJson(value)
    {
        
        // initialized data
        let renderPass = new RenderPass();

        // construct the render pass
        renderPass.name = value.name;

        // arrange the attachments
        //

        // arrange the pipelines
        {

            // iterate through each render pass
            for (let i = 0; i < value.pipelines.length; i++) {

                // initialized data
                let pipeline = Instance.getPipeline(value.pipelines[i])

                // add the render pass
                renderPass.pipelines.push(pipeline);
            }
        }

        // done
        return renderPass;
    }

    // load the render pass from a JSON file
    static async load (uri)
    {

        // success
        return await RenderPass.fromJson(
            await fetchJson(uri)
        );
    }

    draw (){

        // iterate through each pipeline
        for (let i = 0; i < this.pipelines.length; i++) {

            // initialized data
            let pipeline = Instance.getPipeline(this.pipelines[i].name)

            // bind the pipeline
            pipeline.bindOnce();

            // draw each item in the pipeline
            for (let g of pipeline.drawList)
            {

                // bind the drawable
                pipeline.bindEach(g);

                // draw the drawable
                g.draw();
            }
        }
    }

    // create a textual representation of the render pass
    str ( )
    {
        return `
        {
            name : ${this.name},
        }
        `
    }
}