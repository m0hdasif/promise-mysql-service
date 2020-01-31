const mysql = require('promise-mysql');
// const mysql = require('mysql2/promise');
let pool;// = createPool();
createPool().then(res=>{
    pool = res;
    console.log("ASIF: res", res);
}).catch(err=>err);

function createPool(params) {
    return mysql.createPool({
        host: 'localhost',
        user: 'root',
        database: 'localapptest',
        // waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        password:'passw0rd'
      });
}
async function insertOneUser(){
    const connection = await pool.getConnection();
    try {
        console.log("ASIF: insertOneUser -> pool", pool);
        console.log("ASIF: insertOneUser -> connection", connection);
        let results = await connection.query('INSERT INTO user(username,emailid,mobile) VALUES ("asif","asifmansoori@outlook.com",8750016175)');
        console.log("ASIF: insertOneUser -> results", results);
        return results;
    } finally {
        connection.release()
        console.log("ASIF: insertOneUser -> error", error);
        return error;
    }

}

async function getUsers(){
    const connection = await pool.getConnection();
    try {
        let results = await connection.query('SELECT * FROM user');
        console.log("ASIF: getUsers -> results", results);
        return results;
    } finally {
        connection.release();
    }

}
async function insertUsers(){
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
        let result1 = await connection.query('INSERT INTO user(username,emailid,mobile) VALUES ("asif1","asifmansoori@outlook.com",8750016175)');
        console.log("ASIF: insertUsers -> result1", result1);
        let result2 = await connection.query('INSERT INTO user(username,emailid,mobile) VALUES ("asif2","asifmansoori@outlook.com",8750016175)');
        console.log("ASIF: insertUsers -> result2", result2);
        let result3 = await connection.query('INSERT INTO user(username,emailid,mobile) VALUES ("asif3","asifmansoori@outlook.com",8750016175)');
        console.log("ASIF: insertUsers -> result3", result3);
        let result4 = await connection.query('INSERT INTO user(username,emailid,mobile) VALUES ("asif4","asifmansoori@outlook.com",8750016175)');
        console.log("ASIF: insertUsers -> result4", result4);
        await connection.commit();
        return [result1,result2,result3,result4];
      } catch(err){
        console.log("ASIF: insertUsers -> err", err);
        await connection.rollback();
        console.log("ASIF: insertUsers -> err.message", err.message);
        return err.message;
      }finally {
        
        connection.release();
        console.log("ASIF: insertUsers -> connection release" );
      }
}
module.exports={insertOneUser,insertUsers,getUsers};