import mysql from 'mysql2/promise';
import logger from '../logger';

const CONN_LIMIT = 10;
const QUEUE_LIMIT = 0;

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB } = process.env;

// check that all the vars are good now - otherwise the server will seem to run
// fine... until a DB query is attempted at who knows when
[MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DB].forEach((envVar) => {
    if (!envVar) {
        logger.error('Fatal: error in database connection environment variables');
        process.exit(1);
    }
});

const pool = mysql.createPool({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASS,
    database: MYSQL_DB,
    waitForConnections: true,
    connectionLimit: CONN_LIMIT,
    queueLimit: QUEUE_LIMIT,
});

export default pool;
