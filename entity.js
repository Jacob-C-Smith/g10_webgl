class Entity {

    constructor ()
    {
        this.name = "";
        this.transform = null;
        this.geometry = null;
    }

    // load the geometry from a JSON value
    static async fromJson(value)
    {
        
        // initialized data
        let entity = new Entity();
        let pipeline = null;

        // store the name
        entity.name = value.name;

        // store the transform
        entity.transform = await Transform.fromJson(value.transform);

        // store the geometry
        entity.geometry = await Geometry.fromJson(value.geometry);

        // store the color
        if ( value.color != undefined ) 
            entity.color = value.color;

        // store the texture
        if ( value.texture != undefined ) 
            entity.texture = await Texture.load(value.texture);

        // store the pipeline
        pipeline = Instance.getPipeline(value.pipeline)

        // add the entity to the pipeline's draw list
        pipeline.add(entity);
        
        // done
        return entity;
    }

    // load the entity from a JSON file
    static async load (uri)
    {

        // success
        return await Entity.fromJson(
            await fetchJson(uri)
        );
    }

    // bind the entity
    bind (pipeline)
    {

        // bind the transform
        this.transform.bind(pipeline);
        
        // bind the geometry
        this.geometry.bind(pipeline);
    }

    // draw the entity
    draw ( )
    {

        // draw the entity
        this.geometry.draw();
    }

    // create a textual representation of the entity
    str ( )
    {
        return `
        {
            name         : ${this.name},
            geometry     : ${this.geometry.str()}
        }
        `
    }
}
