const pool = require('../services/dbService').pool;


// get list of all feedback with comments
async function get(req,res){

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
}

//get all feedback (with comments ) for specific app
async function getID(req,res) {
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

}

//get all feedback for specific user
async function getUID(req,res) {
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

}

//adds or updates rating & comment for an app from a user
async function post(req,res){
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



}


//adds or updates a notation for feedback from a user
async function postNote(req,res){
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
}

//delete feedback (still not implemented on front end)
async function deleteFeedback(req,res) {
    const text = `DELETE FROM feedback where feedback_id = ${req.params.id}`;

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



module.exports = {
    get,
    getID,
    getUID,
    post,
    postNote,
    deleteFeedback
};