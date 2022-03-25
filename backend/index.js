const {Pool,  Client } = require("pg");

const client = new Client({
    user: "pbmtlhnw",
    host: "kandula.db.elephantsql.com",
    database: "pbmtlhnw",
    password: "zxkwKJAUmzv77yzlG_5bRV6YrZJ2_f_N",
    port: 5432
});

client.connect(function(err){
    if(err) throw err;
    console.log("Connected");
});



const pool = new Pool({
    user: "pbmtlhnw",
    host: "kandula.db.elephantsql.com",
    database: "pbmtlhnw",
    password: "zxkwKJAUmzv77yzlG_5bRV6YrZJ2_f_N",
    port: 5432
});




const express = require('express');


const app = express();
const port = 3000;


//parse JSON
app.use(express.json());
app.use(express.urlencoded({extended: false}));

let webApps = [{
    id:1,
    user_id:1,
    app_name : 'first app',
    app_desc : 'first app description',
    sum_rate :5,
    num_rate : 1,
    created_on: '2022-01-01'

},
    {
        id:2,
        user_id:1,
        app_name : 'second app',
        app_desc : 'second app description',
        sum_rate : 2,
        num_rate : 2,
        created_on: '2022-01-02'

    },
    {
        id: 3,
        user_id:1,
        app_name : 'third app',
        app_desc : 'third app description',
        sum_rate : 5,
        num_rate : 1,
        created_on: '2022-01-01'

    }

];

//set
app.listen(port, () => console.log(`Server lsitening at port ${port}`));



//get
app.get('/webapp', async (req,res)=>{

    const text = `SELECT * FROM web_apps`;

    const client = await pool.connect();
    const adato =  client.query(text, (err,results) =>{
        if (err) {
            console.error(err);
            return;
        }

        res.status(200).json(results.rows)


        client.end();
    });
});

//search for webapp
app.get('/webapp/:id', async(req,res) =>{
    const text = `SELECT * FROM web_apps WHERE app_id  = ${req.params.id}`;

    const client = await pool.connect();
    client.query(text, (err,results) =>{
        if (err) {
            console.error(err);
            return;
        }

        res.status(200).json(results.rows)

        client.end();
    });

});


//post
app.post('/webapp', async(req,res)=>{

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
        VALUES (${webApp.user_id},'${webApp.app_name}','${webApp.app_desc}', 0,0,'${webApp.created_on}')
        `;


    const client = await pool.connect();
    console.log("connected");
    client.query(query, (err,results) =>{
        if (err) {
            console.error(err);
            return;
        }

        res.status(200).json(results);
        client.end();
    });

});


//update
app.put('/webapp/:id', async (req,res) =>{
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

        res.status(200).json(results);
        client.end();
    });

    /**
    let appFound = webApps.find(a => a.id === parseInt(id));
    if(!appFound){
        res.status(404).send('web application not found');
        return;
    }

    if(!req.body.app_name){
        res.status(400).send("App name is required.");
        return;
    }

    appFound.name = req.body.app_name;

    if(req.body.sum_rate){
        appFound.sum_rate += parseInt(req.body.sum_rate);
        appFound.num_rate +=1;
    }
    res.send(appFound);

**/
});

//remove
app.delete('/webapp/:id', async(req,res)=>{

    let query = `DELETE FROM web_apps where app_id = ${req.params.id}`;
    const client = await pool.connect();
    console.log("connected");
    client.query(query, (err,results) =>{
        if (err) {
            console.error(err);
            return;
        }

        res.status(200).json(results);
        client.end();
    });

});

