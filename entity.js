class Entity {

    constructor ()
    {
        super();
        this.name = "";
        this.vert = [];
        this.vertexBuffer = null;
    }

    // load the geometry from a JSON file
    static async load (uri)
    {

        // done
        return super.load(uri);
    }

    // bind the geometry
    bind (pipeline)
    {

        super.bind(pipeline)
    }

    // draw the geometry
    draw ( )
    {
        super.draw();
    }

    // create a textual representation of the 
    str ( )
    {
        super.str();
    }
}
