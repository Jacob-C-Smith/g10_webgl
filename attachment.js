class Attachment {

    constructor ()
    {
        this.name = "";
        this.width = 0;
        this.height = 0;        
        this.pipelines = [ ];
        this.texture = null;
        this.framebuffer = null;
    }

    // load the attachment from a JSON value
    static async fromJson(value)
    {
        // initialized data
        let attachment = new Attachment();

        // set the attachment name
        attachment.name = value.name;

        // set the attachment width
        attachment.width = window.innerWidth;
        attachment.height = window.innerHeight;

        // allocate a texture
        attachment.texture = gl.createTexture();

        // bind the texture
        gl.bindTexture(gl.TEXTURE_2D, attachment.texture);

        // construct a texture
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA,
            attachment.width, attachment.height, 0,
            gl.RGBA, gl.UNSIGNED_BYTE, null
        );

        // options
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // unbind the texture
        gl.bindTexture(gl.TEXTURE_2D, null);

        // alloate a framebuffer
        attachment.framebuffer = gl.createFramebuffer();

        // bind the framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, attachment.framebuffer);

        // construct a framebuffer from the texture
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.TEXTURE_2D,
            attachment.texture,
            0
        );

        // bind
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // cache the attachment
        Instance.setAttachment(attachment.name, attachment);
        
        // done
        return attachment;
    }

    // load the attachment from a JSON file
    static async load (uri)
    {

        // success
        return await Attachment.fromJson(
            await fetchJson(uri)
        );
    }

    bind(){

        // bind the framebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
    }

    // create a textual representation of the attachment
    str ( )
    {
        return `
        {
            name : ${this.name},
        }
        `
    }
}