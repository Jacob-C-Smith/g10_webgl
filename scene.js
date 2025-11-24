class Scene {

    // constructor
    constructor ()
    {

        // construct a scene
        this.name = "";
        this.entities = [ ] 
    }

    // load the scene from a JSON value
    static async fromJson(value)
    {

        // initialized data
        let scene = new Scene();

        // store the name
        scene.name = value.name;

        // load the entities
        {

            // initialized data
            let promises = []
            let results = null;
            
            // load geometries
            for (const path of value.entities) 
                promises.push(
                    Entity.load(path)
                );

            // wait for all geometries to load
            results = await Promise.all(promises);

            // add the loaded entities to the list
            for (const g of results) 
                scene.entities.push(g);
        }

        // done
        return scene;
    }

    // load the scene from a JSON file
    static async load (uri)
    {

        // success
        return await Scene.fromJson(
            await fetchJson(uri)
        );
    }

    // create a textual representation of the scene
    static str ( )
    {
        return `
        {
            name : ${this.name},
        }
        `;
    }
}
