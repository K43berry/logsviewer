// sqlLoader.js
import initSqlJs from 'sql.js';

let sqlJsPromise;

const loadSqlJs = async () => {
    if (sqlJsPromise) {
        return sqlJsPromise;
    }

    sqlJsPromise = new Promise(async (resolve, reject) => {
        try {
            const SQL = await initSqlJs({
                locateFile: (file) => `/path/to/local/${file}` // Update path to your local file if needed
            });
            resolve(SQL);
        } catch (error) {
            reject(error);
        }
    });

    return sqlJsPromise;
};

export default loadSqlJs;
