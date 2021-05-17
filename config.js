var sqlite3 = require('sqlite3');

const dbConnection = function() {
    return new sqlite3.Database('./blogs.db', (err) => {
        if (err) {
            console.log("Error opening database " + err.message);
        }
    });
}

exports.dbConnection = dbConnection;

