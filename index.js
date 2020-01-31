const express = require('express')
const app = express()
const port = 3000
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`))