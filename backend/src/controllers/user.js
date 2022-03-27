const pool = require('../services/dbService').pool;


// get all users
async function get(req, res){


    let uNameSearch = '';
    if (req.body.user_name !== undefined){
        uNameSearch += ' WHERE user_name = ';
        uNameSearch += `'${req.body.user_name}'`;
    }
    const text = `SELECT * FROM users`+uNameSearch;

    console.log(text);
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



//get user by name
async function getByName(req,res){
    const text = `SELECT * FROM users WHERE user_name  = '${req.params.name}' LIMIT 1`;

    console.log(text);
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

//get user by id
async function getByID(req,res){
    const text = `SELECT * FROM users WHERE user_id  = ${req.params.id}`;

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


//create user
async function post(req,res){

    console.log("posting user");
    console.log(req.body);
    if(!req.body.user_name){
        res.status(400).send("user name is required.");
        return;
    }

    const user = {
        user_name : req.body.user_name ,
        created_on : new Date().toISOString().slice(0, 10)
    };
    console.log("sending data :");

    const query = `
        INSERT INTO users ( user_name, created_on)
        VALUES ('${user.user_name}','${user.created_on}') RETURNING user_id
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


//update user
async function put(req,res) {
    const id = req.body.user_id;
    let toUpdate = '';

    if(req.body.app_name !== undefined){toUpdate+= `user_name = '${req.body.app_name}'`;}


    if(toUpdate ===''){
        res.status(400).send('No usable parameters');
        return;
    }



    const query = `UPDATE users 
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

//remove user
async function deleteUser(req,res){

    let query = `DELETE FROM users where user_id = ${req.params.id}`;
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
    getByName,
    getByID,
    post,
    put,
    deleteUser
};