const { Client } = require('pg');

// const pgConfig = {
//     user: 'postgres',
//     host: 'localhost',
//     database: 'handmedown',
//     password: '1234',
//     port: 5432,
// };

const pgConfig = {
    host: 'ec2-52-21-153-207.compute-1.amazonaws.com',
    database: 'd84gh391jbntjj',
    user: 'urtegrhlzovrhr',
    port: 5432,
    password: '8a5e78df01e12ef0601d3143aef9fdbaab8c3df4d98c4e922b5225c72178b0f5',
    ssl: {
        rejectUnauthorized: false
      }
};

exports.createbook = (book, next) => {
    const pgClient = new Client( pgConfig );
    // const client = new Client({
    //     connectionString: process.env.DATABASE_URL,
    //     ssl: {
    //       rejectUnauthorized: false
    //     }
    //   });

    pgClient.connect();

    const query = 'INSERT INTO books' +
        ' (id, title, author, publication, subject, year,' +
        ' description, seller_userid, seller_username, seller_email, seller_phone,price,image_url)'
        + 'VALUES($1, $2, $3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *';
    const values = [book.id, book.title, book.author, book.publication, book.subject, book.year, book.description,
    book.seller_userid, book.seller_username, book.seller_email, book.seller_phone, book.price, book.imageUrl];
    console.log("Values" + JSON.stringify(values))
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

exports.selectbooks = (next) => {
    const pgClient = new Client(pgConfig);

    pgClient.connect();

    const query = ` SELECT * FROM books `;

    pgClient.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        console.log('Data read successful');
        pgClient.end();
        return next(null, res.rows);
    });
}

exports.selectbook = (id, next) => {
    const pgClient = new Client(pgConfig);

    pgClient.connect();

    const query = `select * from books where id = '` + id + `'; `;

    pgClient.query(query, (err, res) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        console.log('Book read successful');
        pgClient.end();
        return next(null, res.rows[0]);
    });
}

