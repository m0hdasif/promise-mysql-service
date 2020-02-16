const mysql             = require('promise-mysql');
const QUERY_COLLECTIONS = require('../../app-config/queries');
const ESC_PATTERN       = /\\"|"(?:\\"|[^"])*"|(\+)/gi; // for escaping double quotes in the query string
const REPLACE_PATTERN = /@~~\w+~~@/;  // for replacing values with query params
// TODO ability to set delimiter
const BEG_DELIMITER = '@~~';
const END_DELIMITER = '~~@';

var pool;

async function createPool() {
    return mysql.createPool({
        host           : process.env.DB_HOST,
        user           : process.env.DB_USER,
        password       : process.env.DB_PASSWORD,
        database       : process.env.DB_NAME,
        connectionLimit: 10,
        queueLimit     : 0
    });
}

async function getConnection() {
    if (!pool)
        pool = await createPool();
    return pool.getConnection();
}

async function query(queryObject) {
    let { query, queryParams } = getQueryAndParams(queryObject);
    let connection             = await getConnection();
    let response               = await connection.query(query, queryParams);
    return response;
}

async function transaction(queryArray) {
    let finalQueryParamArray = queryArray.map(getQueryAndParams);
    let connection           = await getConnection();
    let resultArray          = [];
    try {
        for (let index = 0; index < finalQueryParamArray.length; index++) {
            const queryObject = finalQueryParamArray[index];
            let   result      = await connection.query(queryObject.query, queryObject.queryParams);
            resultArray.push(result);
        }

        await connection.commit();
        return resultArray;
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
}

function getQuery(queryName) {
    let query = QUERY_COLLECTIONS[queryName];
    if (typeof (query) === "string") {
        return query;
    }
    throw new Error('Query not found');
}

function getQueryAndParams(queryObject) {
    let { queryName, queryData = {} } = queryObject;
    let query                         = getQuery(queryName);
    let replaceMatch;
    let requiredQueryParams = [];
    while (replaceMatch = REPLACE_PATTERN.exec(query)) {
        let ifEscExist = getEscMatchArray(query).find(match => {
            return replaceMatch.index >= match.index && replaceMatch.index <= match.lastIndex;
        })
        if (!ifEscExist) {
            let matchLastIndex = replaceMatch[0].length + replaceMatch.index;
            let startSubStr    = query.slice(0, replaceMatch.index);
            let matchSubStr    = query.slice(replaceMatch.index, matchLastIndex);
            requiredQueryParams.push(matchSubStr.slice(BEG_DELIMITER.length, matchSubStr.length - END_DELIMITER.length));
            let endSubStr   = query.slice(matchLastIndex, query.length);
                matchSubStr = matchSubStr.replace(REPLACE_PATTERN, '?');
                query       = startSubStr + matchSubStr + endSubStr;
        }
    }
    let queryParams = getQueryParams(queryData, requiredQueryParams);
    return { query, queryParams };

}


function getEscMatchArray(query) {
    let escMatch;
    let escMatchArray = [];
    while (escMatch = ESC_PATTERN.exec(query)) {
        escMatchArray.push({
            index    : escMatch.index,
            lastIndex: escMatch.index + escMatch[0].length,
            length   : escMatch.length
        });
    }
    return escMatchArray;
}


function getQueryParams(inputParams, requiredParams) {
    return requiredParams.map(p => {
        if (inputParams.hasOwnProperty(p)) {
            return inputParams[p];
        } else {
            throw new Error(`'${p}' not found in query params`);
        }
    })
}

module.exports = { getConnection, query, transaction };