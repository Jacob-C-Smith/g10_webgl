class Framebuffer {

    constructor ()
    {
        this.name = "";
        this.framebuffer = null;
    }

    // load the geometry from a JSON value
    static async fromJson(value)
    {
        
        // initialized data
        let framebuffer = new Framebuffer();

        // store the name
        framebuffer.name = value.name;

        // store the texture
        // if ( value.texture != undefined ) 
        //     framebuffer.texture = await Texture.load(value.texture);

        // done
        return framebuffer;
    }

    // load the framebuffer from a JSON file
    static async load (uri)
    {

        // success
        return await Framebuffer.fromJson(
            await fetchJson(uri)
        );
    }

    // bind the framebuffer
    bind ()
    {
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    }

    // create a textual representation of the framebuffer
    str ( )
    {
        return `
        {
            name : ${this.name},
        }
        `
    }
}
