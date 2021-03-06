import 'dotenv/config';

// use vars from the env or a .env file, but unlike the real pool config, just
// use defaults if they're missing - makes life easier
const config = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'dev',
    password: process.env.MYSQL_PASS || 'devpass',
    database: process.env.MYSQL_DB || 'pradb',
    waitForConnections: true,
    connectionLimit: Number(process.env.MYSQL_CONN_LIMIT) || 10,
    queueLimit: Number(process.env.MYSQL_QUEUE_LIMIT) || 0,
    timezone: '+00:00',
};

export default config;
