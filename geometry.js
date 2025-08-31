class Geometry {
    
    constructor() {
        this.name = "";
        this.vert = [];
        this.vertexBuffer = null;
        this.modelMatrix = mat4.create();
    }

    static async load(uri) {

        // initialized data
        let geometry = new Geometry();
        let data = await fetchJson(uri);
        let vertexBuffer = gl.createBuffer();

        // construct the vertex buffer
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data["vert"]), gl.STATIC_DRAW);
            vertexBuffer.itemSize = 3;
            vertexBuffer.numItems = 3;
        }

        // construct the geometry
        {
            
            // store the name in the result
            geometry.name = data["name"]

            // store the vertex buffer in the result
            geometry.vertexBuffer = vertexBuffer;

            // store the vertices in the result
            geometry.vert = data["vert"]
        }

        // done
        return geometry;
    }

    draw(){
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexBuffer.numItems);
    }

    str() {
        return `
        {
            name         : ${this.name},
            vertices     : [${this.vert}],
            vertexBuffer : ${this.vertexBuffer}
        }
        `
    }
}
