module.exports = Object.freeze({
    getUser       : `SELECT * FROM user`,
    getUserDetails: `SELECT * FROM user WHERE mobile = @~~mobile~~@;`,
    insertUser    : `INSERT INTO user(username,emailid,mobile) VALUES (@~~username~~@, @~~emailid~~@, @~~mobile~~@);`
});