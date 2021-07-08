const { Client } = require('pg');

const pgConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'handmedown',
    password: '1234',
    port: 5432,
};

exports.createuser = (user, next) => {
    const pgClient = new Client( pgConfig );
    
    pgClient.connect();

    const query = 'INSERT INTO users' +
        ' (user_name, user_email, password, create_ts, update_ts)'
        + 'VALUES($1, $2, $3, $4, $5) RETURNING *';
    const values = [user.user_name,user.user_email,user.password,user.create_ts,user.update_ts];
   // console.log("Values" + JSON.stringify(values))
    pgClient.query(query, values, (err, res) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        console.log('Data insert successful');
        pgClient.end();
        return next(null);
    });
}