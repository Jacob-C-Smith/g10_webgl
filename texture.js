class Texture extends Uniform {

    // static fields
    static texture_units = new Map();
    static texture_unit_available = [
        true, true,
        true, true,
        true, true,
        true, true
    ]
    static texture_unit_quantity = 8;

    // constructor
    constructor (name, w, h)
    {
        // argument check
        if (w <= 0 || h <= 0) {
            throw new Error("Error: Empty texture");
        }

        // invoke le' super constructor
        super();
        
        // store the name
        this.name = name;

        // store the dimensions
        this.width = w, this.height = h;

        // construct a texture
        this.texture = gl.createTexture();

        // bind the texture
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        // defaults
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // allocate a texture
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        // unbind
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    // load a texture from a file file
    static async load (uri)
    {
        const img = await new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = "anonymous";
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error("Failed to load image: " + uri));
            image.src = uri;
        });

        // construct the Texture (calls constructor)
        let tex = new Texture(uri, img.width, img.height);

        // upload the image into the texture created by the constructor
        gl.bindTexture(gl.TEXTURE_2D, tex.texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        // generate mipmaps only for power-of-two textures
        const isPowerOfTwo = (v) => (v & (v - 1)) === 0;
        if (isPowerOfTwo(img.width) && isPowerOfTwo(img.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // ensure non-POT textures use clamp-to-edge and linear filtering
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }

        // unbind
        gl.bindTexture(gl.TEXTURE_2D, null);

        // done
        return tex;
    }

    // bind the texture
    bind (pipeline)
    {

        // initialized data
        let texture_unit = Texture.get(this.name);

        if ( texture_unit === undefined ) {
            for ( let i = 0; i < Texture.texture_unit_quantity; i++ )
            {
                if ( Texture.texture_unit_available[i] )
                {

                    // mark unavailable
                    Texture.texture_unit_available[i] = false;

                    // activate the texture
                    gl.activeTexture(gl.TEXTURE0 + i);

                    // bind the texture
                    gl.bindTexture(gl.TEXTURE_2D, this.texture);

                    // bind the uniform
                    gl.uniform1i(pipeline.uniforms.texture, i);

                    // cache the texture
                    Texture.set(this.name, i);
                    
                    // debug
                    console.log(`Texture: BN '${this.name}' -> unit ${i}`);

                    // done
                    return;
                }
            }
        }

        // activate the texture
        gl.activeTexture(gl.TEXTURE0 + texture_unit);

        // bind the texture
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        // bind the uniform
        gl.uniform1i(pipeline.uniforms.texture, texture_unit);

        // debug
        console.log(`Texture: NC '${this.name}' -> unit ${texture_unit}`);
    }

    static get(key) {

        // argument check
        if (!Texture.texture_units.has(key))
            return undefined;

        // initialized data
        let value = Texture.texture_units.get(key);

        // recently used
        Texture.texture_units.delete(key);
        Texture.texture_units.set(key, value);

        // done
        return value;
    }

    static set(key, value) {

        // recently used
        if (Texture.texture_units.has(key)) {
            Texture.texture_units.delete(key); 
        }

        // set the property
        Texture.texture_units.set(key, value);

        // evict
        if (Texture.texture_units.size > Texture.texture_unit_quantity) {
                
            // initialized data
            let oldestKey = Texture.texture_units.keys().next().value;
            let oldestValue = Texture.texture_units.get(oldestKey);

            // remove the oldest key and free its unit
            Texture.texture_units.delete(oldestKey);

            // mark available
            Texture.texture_unit_available[oldestValue] = true;
        }

        // done
        return;
    }

    static textureUnitStr(){
        return `
        ${this.texture_units}, ${this.texture_unit_available}
        `
    }

    // create a textual representation of the texture
    str ( )
    {
        return `
        {
            name : ${this.name}
        }
        `
    }
}
