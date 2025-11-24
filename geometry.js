class Geometry extends Drawable {

    constructor ()
    {
        super();
        this.name = "";
        this.xyz = [];
        this.uv = [];
        this.xyz_buffer = null;
        this.uv_buffer = null
    }

    // load the geometry from a JSON value
    static async fromJson(value)
    {
    
        // test the cache
        if ( Instance.getGeometry(value.name) != null ) {
            return Instance.getGeometry(value.name);
        }

        // initialized data
        let geometry = new Geometry();

        // store the name in the result
        geometry.name = value.name;
        
        // construct the vertex buffer
        if ( value.xyz.length > 0 ) {

            // allocate a vertex buffer
            geometry.xyz_buffer = gl.createBuffer();

            // bind the vertex buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, geometry.xyz_buffer);

            // buffer the geometry
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(value.xyz), gl.STATIC_DRAW);

            // options
            geometry.xyz_buffer.itemSize = 3;
            geometry.xyz_buffer.numItems = value.xyz.length / geometry.xyz_buffer.itemSize;

            // store the vertices in the result
            geometry.xyz = value.xyz;
        }

        // construct the texture coordinate buffer 
        if ( value.uv ) if ( value.uv.length > 0 ) {
            
            // allocate a vertex buffer
            geometry.uv_buffer = gl.createBuffer();

            // bind the vertex buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, geometry.uv_buffer);

            // buffer the geometry
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(value.uv), gl.STATIC_DRAW);

            // options
            geometry.uv_buffer.itemSize = 3;
            geometry.uv_buffer.numItems = value.uv.length / geometry.uv_buffer.itemSize;

            // store the vertices in the result
            geometry.uv = value.uv;
        }

        // cache the geometry
        Instance.setGeometry(geometry.name, geometry);
        
        // done
        return geometry;
    }

    // load the geometry from a JSON file
    static async load (uri)
    {

        // success
        return await Geometry.fromJson(
            await fetchJson(uri)
        );
    }

    // construct a triangle
    static async constructTriangle(name)
    {
        return await Geometry.fromJson(
            `
            {
                "name" : "${name}",
                "xyz" : 
                [
                    -0.5, 0.5, 1,
                    -1 ,-0.5, 1,
                    0.0 ,-0.5, 1
                ]
            }
            `
        );
    }

    // construct a quad
    static async constructQuad(name)
    {
        return await Geometry.fromJson(
            `
{
    "name" : "${name}",
    "xyz" : 
    [
        0.0, 0.0, 0,
        1.0, 0.0, 0,
        1.0, 1.0, 0,
        0.0, 0.0, 0,
        0.0, 1.0, 0,
        1.0, 1.0, 0
    ]
}
            `
        )
    }

    // bind the geometry
    bind (pipeline)
    {

        // bind the vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.xyz_buffer);

        // bind each vertex attribute
        for (const [k, v] of Object.entries(pipeline.vertexAttributes)) {
            gl.vertexAttribPointer(v, this.xyz_buffer.itemSize, gl.FLOAT, false, 0, 0);
        }
    }

    // draw the geometry
    draw ( )
    {

        // draw the geometry
        gl.drawArrays(gl.TRIANGLES, 0, this.xyz_buffer.numItems);
    }

    // create a textual representation of the 
    str ( )
    {
        return `
        {
            name       : ${this.name},
            xyz        : [${this.xyz}],
            xyz_buffer : ${this.xyz_buffer},
            uv         : [${this.uv}],
            uv_buffer  : [${this.uv_buffer}]
        }
        `
    }
}
