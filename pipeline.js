class Pipeline {

    constructor() {
        this.name = ""
        this.shader = null
    }
    
    static async fromJson(value){

        // initialized data
        let pipeline = new Pipeline();
        let shaderSource = value["source"];

        pipeline.name = value["name"];
        pipeline.shader = Shader.fromJson(shaderSource)

        // success
        return pipeline;
    }

    static async load(uri) {

        // success
        return await Pipeline.fromJson(
            await fetchJson(uri)
        );
    }

    str()
    {
        return `
        {
            name         : ${this.name},
            source       : 
            {
                vert: "
${this.vertSource}
                ",
                frag: "
${this.fragSource}
                "
            }
        }
        `
    }
}