const sqlite3 = require('sqlite3').verbose();

let db;

const sqlDatabase = {
    init: () => {
        if (!db) {
            db = new sqlite3.Database('./main.db')
            
        }
    },

    closeDb: () => {
        if (db) {
            db.close((err) => {
                if (err) {
                    console.error(err.message);
                }
                db = null;
            });
        }
    },

    run: (statement, params = []) => {
        return new Promise((resolve, reject) => {
            db.run(statement, params, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this);
                }
            });
        });
    },

    all: (statement, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(statement, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
};

// Automatically initialize the database connection when the module is required
sqlDatabase.init();

module.exports = sqlDatabase;
