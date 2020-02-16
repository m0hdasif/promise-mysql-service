const mysql = require('./utils/sql');

async function insertOneUser() {
    const result = await mysql.query({ queryName: 'getUserDetails', queryData: { mobile: '8750016175' } });
    return result;
}
async function insertUsers() {
    let queryArray = [
        { queryName: 'insertUser', queryData: { username: 'asif', emailid: 'asif@gmail.com', mobile: '5678876' } },
        { queryName: 'insertUser', queryData: { username: 'asif', emailid: 'asif@gmail.com', mobile: '5678876' } },
        { queryName: 'insertUser', queryData: { username: 'asif', emailid: 'asif@gmail.com', mobile: '5678876' } },
        { queryName: 'getUserDetails', queryData: { mobile: '8750016175' } }
    ];
    const resultArray = await mysql.transaction(queryArray);
    return resultArray;
}

async function getUsers() {
    const result = await mysql.query({ queryName: 'getUser' });
    return result;
}

module.exports = { insertOneUser, insertUsers, getUsers };