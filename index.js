const express = require('express');
const app = express();
require('./config'); // To load environment variables

const PORT = process.env['PORT'];

let user = require('./user');
app.get('/', (req, res) => {
    user.getUsers().then((results,err)=>{
        console.log("ASIF: err", err);
        console.log("ASIF: results", results);
        res.send(results);
    }).catch(err=>{
        console.log("ASIF: err", err);
        res.send(err)
    });
});


app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))