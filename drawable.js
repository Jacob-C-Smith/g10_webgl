class Drawable {

    constructor ( )
    {
    }

    static async load (uri, ...uniformBinds)
    {

        // initialized data
        let drawable = new Drawable();
        let geometry = await super.load(uri);

        // store the geometry
        drawable.name = geometry.name;
        drawable.vert = geometry.vert;
        drawable.vertexBuffer = geometry.vertexBuffer;

        // debugging
        uniformBinds.forEach(element => console.log(element));
        
        // done
        return drawable;
    }

    draw ( )
    {
        return super.draw();
    }

    str ( ) {
        return super.str();
    }
}