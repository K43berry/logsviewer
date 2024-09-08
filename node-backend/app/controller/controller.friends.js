
const sqlDatabase = require('../middleware/middleware.sql');

getEmail = async (user) => {
    try {
        const result = await sqlDatabase.all('SELECT email FROM userinfo WHERE user = ?', [user]);
        if (result.length > 0) {
            return result[0].email;
        } else {
            throw new Error(`Email not found for user: ${user}`);
        }
    } catch (error) {
        throw new Error(`Error getting email for user: ${user}. ${error.message}`);
    }
}


exports.createFriendship = async (req, res) => {


    try {
        const user = req.user
        const friendReceived = req.body.friendReceived

        await sqlDatabase.run(`INSERT OR IGNORE INTO friends 
            (friendSharedUser, friendReceivedUser) 
            VALUES (?, ?)`, [user, friendReceived]);

        res.status(200).send({
            message: 'ok'
        })
    } catch (error) {
        res.status(403).send({
            message: "error during db update/current user email",
            error: error
        })
    }

  }

  exports.getAllSharedTo = async (req,res) => {
    try {
        const user = req.user

        const query = await sqlDatabase.all("SELECT friendReceivedUser FROM friends WHERE friendSharedUser = ?", user)

        res.status(200).send({
            message: 'ok',
            listOfFriends: query
        })

    } catch (error) {
        res.status(403).send({
            message: "error getting list of friends",
            error: error
        })
    }
  }

  exports.getAllReceived = async (req, res) => {
    try {
        const user = req.user

        const query = await sqlDatabase.all("SELECT friendSharedUser FROM friends WHERE friendReceivedUser = ?", user)

        res.status(200).send({
            message: 'ok',
            listOfFriends: query
        })

    } catch (error) {
        res.status(403).send({
            message: "error getting list of friends",
            error: error
        })
    }
  }

exports.removeFriendShared = async (req, res) => {
    try {
        const user = req.user
        const other = req.body.friendReceived

        await sqlDatabase.run("DELETE FROM friends where (friendSharedUser = ? AND friendReceivedUser = ?)", [user, other])

        res.status(200).send({
            message: 'ok',
        })

    } catch (error) {
        res.status(403).send({
            message: "error removing friend",
            error: error
        })
    }
}

exports.removeFriendReceived = async (req, res) => {
    try {
        const user = req.user
        const other = req.body.friendReceived

        await sqlDatabase.run("DELETE FROM friends where (friendSharedUser = ? AND friendReceivedUser = ?)", [other, user])

        res.status(200).send({
            message: 'ok',
        })

    } catch (error) {
        res.status(403).send({
            message: "error removing friend",
            error: error
        })
    }
}

exports.checkConnectionShared = async (req, res) => {
    try {
        const user = req.user
        const other = req.body.friendReceived


        const query = await sqlDatabase.all("SELECT * FROM friends WHERE (friendSharedUser = ? AND friendReceivedUser = ?)", [user, other])
        
        if(query){
            if(query.length > 0) {
                res.status(200).send({
                    message: 'ok',
                    isConnected: true
                })
            } else {
                res.status(200).send({
                    message: 'ok',
                    isConnected: false
                })
            }
        } else {
            res.status(200).send({
                message: 'ok',
                isConnected: false
            })
        }
    } catch (error) {
        res.status(403).send({
            messaage: 'error checking connection between two',
            error: error
        })
    }
}

exports.checkConnectionReceived = async (req, res) => {
    try {
        const user = req.user
        const other = req.body.friendReceived


        const query = await sqlDatabase.all("SELECT * FROM friends WHERE (friendSharedUser = ? AND friendReceivedUser = ?)", [other,user])
        
        if(query){
            if(query.length > 0) {
                res.status(200).send({
                    message: 'ok',
                    isConnected: true
                })
            } else {
                res.status(200).send({
                    message: 'ok',
                    isConnected: false
                })
            }
        } else {
            res.status(200).send({
                message: 'ok',
                isConnected: false
            })
        }
    } catch (error) {
        res.status(403).send({
            messaage: 'error checking connection between two',
            error: error
        })
    }
}

exports.getFriendsDb = async (req, res) => {
    try {
        const user = req.user
        const other = req.body.friendReceived

        const query = await sqlDatabase.all("SELECT * FROM friends WHERE (friendSharedUser = ? AND friendReceivedUser = ?)", [other, user])
        
        if (query && query.length > 0) {

            const email = await getEmail(other);

            const entityMessage = await sqlDatabase.all('SELECT * FROM entity WHERE user=?', [email]);
            const encounterMessage = await sqlDatabase.all('SELECT * FROM encounter WHERE user=?', [email]);
        
            res.status(200).send({
                entity: entityMessage,
                encounter: encounterMessage
            });
        } else {
            res.status(400).send({
                message: "No valid permissions or data found"
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Something went wrong with getting db",
            error: error
        });
    }
};