class Input {

    // constructor
    constructor ()
    {

        // construct an input
        this.name = "";
        this.binds = { };
        this.bindReverse = { }
    }

    // load the input from a JSON value
    static async fromJson(value)
    {

        // initialized data
        let input = new Input();

        // store the name
        input.name = value.name;

        // iterate through each bind
        for(let i = 0; i < value.binds.length; i++)
        {

            // store the current bind
            let iBind = value.binds[i];

            // construct a bind
            let bind = await Bind.fromJson(iBind);

            // add the bind to the binds
            input.binds[bind.name] = bind;

            // iterate through each key
            for(let j = 0; j < bind.keys.length; j++)
            {
                // add the key to the reverse lookup
                input.bindReverse[bind.keys[j]] = bind.name;
            }
        }
        
        // keydown
        addEventListener("keydown", (event) => {

            // state check
            if (event.repeat) return;

            // initialized data
            let k = event.key;
            let bName = Instance.input.bindReverse[k];

            // ON
            Instance.input.binds[bName].value = 1.0;
        })


        // keyup
        addEventListener("keyup", (event) => {

            // initialized data
            let k = event.key;
            let bName = Instance.input.bindReverse[k];

            // OFF
            Instance.input.binds[bName].value = 0.0;
        })

        // done
        return input;
    }

    // load the input from a JSON file
    static async load (uri)
    {

        // success
        return await Input.fromJson(
            await fetchJson(uri)
        );
    }

    // create a textual representation of the input
    static str ( )
    {
        return `
        {
            name : ${this.name},
        }
        `;
    }
}

class Bind
{

    constructor ()
    {
        
        // construct a bind
        this.name = "";
        this.keys = [ ];
        this.value = 0.0;
    }

    // load the bind from a JSON value
    static async fromJson(value)
    {

        // initialized data
        let bind = new Bind();

        // store the name
        bind.name = value.name;

        // iterate through each key
        for(let i = 0; i < value.keys.length; i++)
        {
            bind.keys.push(value.keys[i])
        }

        bind.value = 0.0;

        // done
        return bind;
    }

    getInput(name)
    {

    }

    // create a textual representation of the bind
    static str ( )
    {
        return `
        {
            name : ${this.name},
        }
        `;
    }
}