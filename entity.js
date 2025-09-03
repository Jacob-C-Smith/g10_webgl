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

        // construct the entity
        entity.name = value.name;
        entity.transform = await Transform.fromJson(value.transform);
        entity.geometry = await Geometry.fromJson(value.geometry);
        entity.color = value.color;

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
        
        // bind the color
        gl.uniform3f(pipeline.uniforms.color, ...this.color);

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
