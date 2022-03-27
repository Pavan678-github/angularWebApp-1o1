const {Pool,  Client } = require("pg");

/**
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
**/


const pool = new Pool({
    user: "pbmtlhnw",
    host: "kandula.db.elephantsql.com",
    database: "pbmtlhnw",
    password: "zxkwKJAUmzv77yzlG_5bRV6YrZJ2_f_N",
    port: 5432,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
    //connectionLimit : 1,
    //waitForConnections : true

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

        res.setHeader('Content-Type', 'application/json');
        client.release();
        res.status(200).json(results.rows);



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
        client.release();
        res.status(200).json(results.rows)


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

        client.release();
        res.status(200).json(results);
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

        client.release();
        res.status(200).json(results);
    });

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// users


app.get('/user', async (req,res)=>{

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
});

app.get('/username/:name', async(req,res) =>{
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

});



//search for webapp
app.get('/user/:id', async(req,res) =>{
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

});


//post
app.post('/user', async(req,res)=>{

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

});


//update
app.put('/user/:id', async (req,res) =>{
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

});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// feedback



app.get('/feedback', async (req,res)=>{

    const text = `SELECT * FROM feedback`;

    const client = await pool.connect();
    client.query(text, (err,results) =>{
        if (err) {
            console.error(err);
            return;
        }

        client.release();


        res.status(200).json(results.rows)
    });
});

//get all feedback for specific app
app.get('/feedback/:id', async(req,res) =>{
    const text = `SELECT * FROM feedback, users WHERE feedback.app_id  = ${req.params.id} AND users.user_id = feedback.user_id`;

    const client = await pool.connect();
    client.query(text, (err,results) =>{
        if (err) {
            console.error(err);
            return;
        }

        client.release();

        res.status(200).json(results.rows)
    });

});

//get all feedback for specific user
app.get('/userfeedback/:id', async(req,res) =>{
    const text = `SELECT * FROM feedback WHERE user_id  = ${req.params.id}`;

    const client = await pool.connect();
    client.query(text, (err,results) =>{
        if (err) {
            console.error(err);
            return;
        }

        client.release();

        res.status(200).json(results.rows)
    });

});


//post
app.post('/user', async(req,res)=>{

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
        VALUES ('${user.user_name}','${user.created_on}')
        `;


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

});


//update
app.put('/user/:id', async (req,res) =>{
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

});



//post
app.post('/feedback/:id', async(req,res)=>{
    const id = req.params.id;


    toUpdate = ' ';
    if(req.body.user_id !== undefined){toUpdate+= `user_id = '${req.body.user_id}',`;}
    if(req.body.comment !== undefined){toUpdate+= `comment = '${req.body.comment}',`;}
    if(req.body.rating !== undefined){toUpdate+= `rating = '${req.body.rating}',`;}

    toUpdate = toUpdate.slice(0,-1);

    let columnString = 'app_id,user_id, comment , rating'; //(comment , rating , notation) based off of body params
    let valueString = `${id},${req.body.user_id} , '${req.body.comment}' , ${req.body.rating}` ;
    let commonString = `comment = '${req.body.comment}' ,  rating = ${req.body.rating}`;

    let columnString2 = `app_id , user_id `;
    let valueString2 = `${id} , ${req.body.user_id}`;


    // removes current rating from webapp
    const prequery = ` DO $$
                    begin
                IF EXISTS (SELECT * from feedback where app_id = ${id} and user_id = ${req.body.user_id}) 
                    THEN UPDATE web_apps SET sum_rate = sum_rate - (SELECT rating from feedback where app_id = ${id} and user_id = ${req.body.user_id}) , num_rate = num_rate - 1 ;
                END IF;
                END
                $$;
    `;

    // adds/updates feedback entry
    const query = ` INSERT INTO feedback (${columnString}) 
    VALUES (${valueString}) 
    ON CONFLICT (app_id, user_id) DO UPDATE 
    SET ${commonString};
    `;

    console.log(query);


    //adds/updates feedback record
    const query2 = `insert into notation (${columnString2}) 
    values (${valueString2}) 
    on conflict (app_id , user_id) DO NOTHING;
    `;

    //updates webapp notation
    const query3 = `UPDATE web_apps set sum_rate = sum_rate + (SELECT rating from feedback where  app_id = ${id} and user_id = ${req.body.user_id}) , num_rate = num_rate + 1 RETURNING (select * from feedback where feedback_id = ${req.body.feedback_id});`;

    //todo check if params are there and send error if needed

    // comment , rating , notation , user_id
    //update comment , rating , notation where app_id = id & user_id == user_id

    const client = await pool.connect();

/**
    await client.query(prequery, (err,results) =>{

        console.log("pre query");

        if (err) {
            console.error(err);
        }});

    await client.query(query, (err,results) =>{

        console.log("second query");

    if (err) {
        console.error(err);

    }});


    await client.query(query2, (err,results) =>{
        console.log("third query");

        if (err) {
        console.error(err);

    }});


    await client.query(query3, (err,results) =>{
        console.log("fourth" +
            " query");
    if (err) {
        console.error(err);

    }});

**/

    await client.query(prequery)
        .then(results => {
        })
        .then(() => client.query(query))
        .then(results => {
        })
        .then(() => client.query(query2))
        .then(results => {
        })
        .then(() => client.query(query3))
        .then(results => {
            client.release();
            res.status(200).json(results);
        })
        .catch(err => {
            // better to handle errors at the end, probably
            console.log(err.stack)
        })

    client.release();
    res.status(200).send('ok');
});



//post notation on comment
app.post('/notation/:id', async(req,res)=>{
    const id = req.params.id;


    // removes current rating from webapp
    const prequery = ` DO $$
                    begin
                IF EXISTS (SELECT * from feedback where feedback_id = ${req.body.feedback_id} and user_id = ${req.body.user_id}) 
                    THEN UPDATE feedback SET notation = notation + ( ${req.body.notation} - (SELECT notation from feedback where feedback_id = ${req.body.feedback_id} and user_id = ${req.body.user_id}))  where app_id = ${id} ;
                ELSE 
                UPDATE feedback SET notation = notation + ( ${req.body.notation} ) where app_id = ${id}  ;
                    
                END IF;
                END
                $$;
    `;
    console.log("prequery");
    console.log(prequery);

    // adds/updates feedback entry
    const query = ` INSERT INTO notation (feedback_id , user_id, notation) 
    VALUES (${id}, ${req.body.user_id} , ${req.body.notation}) 
    ON CONFLICT (feedback_id, user_id) DO UPDATE 
    SET notation = ${req.body.notation};
    `;

    //todo check if params are there and send error if needed

    // comment , rating , notation , user_id
    //update comment , rating , notation where app_id = id & user_id == user_id

    const client = await pool.connect();

    /**
     console.log(prequery+query+query2+query3);
     await client.query(prequery+query+query2+query3).then(result => {
        console.log(prequery+query+query2+query3);
    }).catch(err => {
        console.log(err);
    })
     **/
    /**
     await client.query(prequery, (err,results) =>{

        console.log("pre query");

        if (err) {
            console.error(err);
        }});

     await client.query(query, (err,results) =>{

        console.log("second query");

    if (err) {
        console.error(err);

    }});


     await client.query(query2, (err,results) =>{
        console.log("third query");

        if (err) {
        console.error(err);

    }});


     await client.query(query3, (err,results) =>{
        console.log("fourth" +
            " query");
    if (err) {
        console.error(err);

    }});

     **/

    await client.query(prequery)
        .then(results => {
            console.log("FIRST RESULTS: " + results);
        })
        .then(() => client.query(query))
        .then(results => {
            console.log("SECOND RESULTS: " + results);
        })
        .catch(err => {
            // better to handle errors at the end, probably
            console.log(err.stack)
        })

    client.release();
    res.status(200).send('ok');
});





// post comment on web app if user hasn't already
// notation on feedback if user hasn't already (upsert)
//update feedback
//
