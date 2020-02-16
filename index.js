const express = require('express');
const app = express();
require('./config'); // To load environment variables

const PORT = process.env['PORT'];

let user = require('./user');

app.get('/', (req, res) => {
    user.insertUsers().then((results,err)=>{
        console.log("ASIF: err", err);
        console.log("ASIF: results", results);
        res.send(results);
    }).catch(err=>{
        console.log("ASIF: err", err);
        res.send(err.message)
    });
});


app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))