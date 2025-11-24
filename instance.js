class Instance {

    // singleton
    static name = "";
    static renderer = null
    static scene = null
    static cache = { 
        pipeline: { },
        geometry: { }
    }

    constructor ()
    {

        // error 
        throw new Error('[instance] Instance class can not be instantiated');
    }

    // load the geometry from a JSON value
    static async fromJson(value)
    {
        
        // store the name
        this.name = value.name;

        // construct the renderer
        this.renderer = await Renderer.load(value.renderer);

        // construct the scene
        this.scene = await Scene.load(value.scene);

        // done
        return this;
    }

    // load the instance from a JSON file
    static async load (uri)
    {

        // success
        return await Instance.fromJson(
            await fetchJson(uri)
        );
    }

    // get the active instance
    static active () {
        return Instance;
    }

    // get a pipeline from the cache
    static getPipeline ( name ) {
        return this.cache.pipeline[name];
    }

    // set a pipeline in the cache
    static setPipeline ( name, pipeline ) {

        // error check
        if ( name == null ) {

            // error 
            console.error("[instance] Can not cache unnamed pipeline");
        }
        if ( pipeline == null ) {

            // error 
            console.error("[instance] Can not cache null pipeline");
        }

        // store the pipeline
        this.cache.pipeline[name] = pipeline;
    }
    
    // get geometry from the cache
    static getGeometry ( name ) {
        return this.cache.geometry[name];
    }

    // set geometry in the cache
    static setGeometry ( name, geometry ) {

        // error check
        if ( name == null ) {

            // error 
            console.error("[instance] Can not cache unnamed geometry");
        }
        if ( geometry == null ) {

            // error 
            console.error("[instance] Can not cache null geometry");
        }

        // store the geometry
        this.cache.geometry[name] = geometry;
    }

    // create a textual representation of the instance
    static str ( )
    {
        return `
        {
            name : ${this.name},
        }
        `;
    }
}
