const DOTENV = require('dotenv');
const CONFIG = DOTENV.config({ path: __dirname + '/.env' });
if (CONFIG.error) {
    throw CONFIG.error;
}
const { parsed: env } = CONFIG;

module.exports = env;