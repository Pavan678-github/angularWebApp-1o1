const pool = require('../services/dbService').pool;


async function get(req,res){

    const text = `SELECT * FROM web_apps`;

    const client = await pool.connect();
    const adato =  client.query(text, (err,results) =>{
        if (err) {
            console.error(err);
            return;
        }

        res.setHeader('Content-Type', 'application/json');
        client.release();
        res.status(200).json(results.rows);



    });
}

//get app by id
async function getID(req,res) {
    const text = `SELECT * FROM web_apps WHERE app_id  = ${req.params.id}`;

    const client = await pool.connect();
    client.query(text, (err,results) =>{
        if (err) {
            console.error(err);
            return;
        }
        client.release();
        res.status(200).json(results.rows)


    });

}


//create a webapp
async function post(req,res){

    if(!req.body.app_name){
        res.status(400).send("App name is required.");
        return;
    }

    const webApp = {
        user_id : req.body.user_id,
        app_name : req.body.app_name ,
        app_desc : req.body.app_desc ,
        sum_rate : 0 ,
        num_rate : 0 ,
        created_on : new Date().toISOString().slice(0, 10)
    };
    console.log("sending data :");
    console.log(webApp);

    const query = `
        INSERT INTO web_apps ( user_id, app_name,app_desc, sum_rate,num_rate,created_on)
        VALUES (${webApp.user_id},'${webApp.app_name}','${webApp.app_desc}', 0,0,'${webApp.created_on}') RETURNING *
        `;


    const client = await pool.connect();
    console.log("connected");
    client.query(query, (err,results) =>{
        if (err) {
            console.error(err);
            return;
        }

        client.release();
        res.status(200).json(results.rows);
    });

}


//update app by id
async function put(req,res){
    const id = req.body.app_id;
    let toUpdate = '';

    if(req.body.app_name !== undefined){toUpdate+= `app_name = '${req.body.app_name}',`;}
    if(req.body.app_desc !== undefined){toUpdate+= `app_desc = '${req.body.app_desc}',`;}
    if(req.body.sum_rate !== undefined){toUpdate+= `sum_rate = sum_rate + ${req.body.sum_rate} , num_rate = num_rate + 1,`;}

    if(toUpdate ===''){
        console.log(req.body.id);
        console.log(req.body.app_name);
        res.status(400).send('No usable parameters');
        return;
    }
    toUpdate = toUpdate.slice(0, -1); //removes last comma



    const query = `UPDATE web_apps 
    SET ${toUpdate}
    where app_id = ${id}
    `;

    console.log(query);

    const client = await pool.connect();
    console.log("connected");
    client.query(query, (err,results) =>{
        if (err) {
            console.error(err);
            return;
        }

        client.release();
        res.status(200).json(results);
    });

}

//delete webapp
async function deleteApp(req,res){

    let query = `DELETE FROM web_apps where app_id = ${req.params.id}`;
    const client = await pool.connect();
    console.log("connected");
    client.query(query, (err,results) =>{
        if (err) {
            console.error(err);
            return;
        }

        client.release();
        res.status(200).json(results);
    });

}


module.exports = {
    get,
    getID,
    post,
    put,
    deleteApp
};