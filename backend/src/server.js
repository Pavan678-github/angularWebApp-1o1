const express = require('express');
const app = express();
//const port = process.env.PORT || 3000;
const router = require('./routes/routers');


const path = require('path');
const fs = require('fs');

//parse JSON
app.use(express.static('dist'))
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('login', express.static(path.resolve('/login')));
const port = process.env.NODE_PORT || 3000;




app.use(``, router);


/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({'message': err.message});

    return;
});


app.listen(port, () => console.log(`Server lsitening at port ${port}`));





/**
//get all apps
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

//get app by id
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


//create a webapp
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


//update app by id
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

});

//delete webapp
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

// get all users
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

//get user by name
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

//get user by id
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


//create user
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


//update user
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

});

//remove user
app.delete('/user/:id', async(req,res)=>{

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


// get list of all feedback with comments
app.get('/feedback', async (req,res)=>{

    const text = `SELECT * FROM feedback WHERE LENGTH(comment) > 0`;

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

//get all feedback (with comments ) for specific app
app.get('/feedback/:id', async(req,res) =>{
    const text = `SELECT * FROM feedback, users WHERE feedback.app_id  = ${req.params.id} AND users.user_id = feedback.user_id AND LENGTH(feedback.comment) > 0`;

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


//adds or updates rating & comment for an app from a user
app.post('/feedback/:id', async(req,res)=>{
    const id = req.params.id;



    // removes current rating from webapp
    const prequery = ` DO $$
                    begin
                IF EXISTS (SELECT * from feedback where app_id = ${id} and user_id = ${req.body.user_id}) 
                    THEN UPDATE web_apps SET sum_rate = sum_rate - (SELECT rating from feedback where app_id = ${id} and user_id = ${req.body.user_id}) , num_rate = num_rate - 1 ;
                ELSE 
                    INSERT into feedback ( app_id, user_id, comment , rating) VALUES ('${id}' , '${req.body.user_id}' , '${req.body.comment}' , '${req.body.rating}'); 
                END IF;
                END
                $$;
    `;


//this works because on psql server there is an index rule allowing only one pair of user_id to app id
const query = `UPDATE feedback SET comment = '${req.body.comment}' , rating = ${req.body.rating} WHERE user_id = ${req.body.user_id} AND app_id = ${id};
    `;


    //updates webapp notation
    const query2 = `UPDATE web_apps set sum_rate = sum_rate +  ${req.body.rating} , num_rate = num_rate + 1;`;



    // comment , rating , notation , user_id
    //update comment , rating , notation where app_id = id & user_id == user_id

    const client = await pool.connect();

    await client.query(prequery)
        .then(results => {
        })
        .then(() => client.query(query))
        .then(results => {
        })
        .then(() => client.query(query2))
        .then(results => {
            client.release();
            res.status(200).send(results.rows);
        })
        .catch(err => {
            console.log(err.stack);
            client.release();
        })



});



//adds or updates a notation for feedback from a user
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

    const query = ` INSERT INTO notation (feedback_id , user_id, notation) 
    VALUES (${id}, ${req.body.user_id} , ${req.body.notation}) 
    ON CONFLICT (feedback_id, user_id) DO UPDATE 
    SET notation = ${req.body.notation};
    `;


    const client = await pool.connect();


    await client.query(prequery)
        .then(results => {
        })
        .then(() => client.query(query))
        .then(results => {
        })
        .catch(err => {
            console.log(err.stack)
        })

    client.release();
    res.status(200).send('ok');
});


**/