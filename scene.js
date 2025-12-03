class Scene {

    // constructor
    constructor ()
    {

        // construct a scene
        this.name = "";
        this.entities = [ ];
        this.activeCamera = null;
        this.cameras = [ ];
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
            
            // load entities
            for (const path of value.entities) 
                promises.push(
                    Entity.load(path)
                );

            // wait for all entities to load
            results = await Promise.all(promises);

            // add the loaded entities to the list
            for (const g of results) 
                scene.entities.push(g);
        }

        // load the cameras
        {

            // initialized data
            let promises = []
            let results = null;
            
            // load cameras
            for (const path of value.cameras) 
                promises.push(
                    Camera.load(path)
                );

            // wait for all cameras to load
            results = await Promise.all(promises);

            // add the loaded cameras to the list
            for (const g of results) 
                scene.cameras.push(g);
        }

        // set the active camera
        scene.activeCamera = scene.cameras[0];

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
