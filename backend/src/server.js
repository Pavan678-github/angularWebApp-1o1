const express = require('express');
const app = express();
//const port = process.env.PORT || 3000;
const router = require('./routes/routers');


const path = require('path');
const fs = require('fs');

//parse JSON

app.use(express.json());
app.use(express.urlencoded({extended: false}));


const port = process.env.NODE_PORT || 3000;




app.use(`/`, router);



/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({'message': err.message});

    return;
});


app.listen(port, () => console.log(`Server lsitening at port ${port}`));



