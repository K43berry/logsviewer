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

exports.uploadAll = async (req, res) => {
    try {
        const user = req.user;

        const email = await getEmail(user);

        const encounters = req.body.encounter;
        const entities = req.body.entity;

        for (let i = 0; i < encounters.length; i++) {
            const encounterValues = encounters[i].slice();
            encounterValues.push(email);
            encounterValues[10] = JSON.stringify(encounterValues[10])

            await sqlDatabase.run(
                `INSERT OR IGNORE INTO encounter 
                (
                id, 
                fight_start, 
                local_player, 
                current_boss, 
                duration, 
                total_damage_dealt, 
                top_damage_dealt, 
                total_dps, 
                difficulty, 
                cleared, 
                party_info, 
                user
                ) 
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
                encounterValues
            );

            const newEntities = entities.filter(e => e[2] == encounterValues[0])
            const newLen = newEntities.length

            for (let j = 0; j < newLen; j++) {
            
                const entityValues = newEntities[j].slice()
                const newEntityValues = [ 
                    entityValues[0],
                    entityValues[1],
                    entityValues[3],
                    entityValues[4],
                    entityValues[5],
                    entityValues[6],
                    entityValues[7], 
                    entityValues[8],
                    entityValues[9],
                    entityValues[10],
                    entityValues[11],
                    entityValues[12],
                    entityValues[13],
                    entityValues[14],
                    entityValues[15],
                    entityValues[16],
                    entityValues[17],//deathtime
                    entityValues[18],
                    entityValues[19],
                    entityValues[20],
                    entityValues[21],
                    entityValues[22],
                    entityValues[23],
                    encounterValues[1],
                    email
                ] //13

                

                await sqlDatabase.run(
                    `INSERT OR IGNORE INTO entity (
                    name,
                    character_id,
                    npc_id,
                    entity_type,
                    class_id,
                    class,
                    gear_score,
                    max_hp,
                    is_dead,
                    dps,
                    damageDealt,
                    damageTaken,
                    debuffedBySupport,
                    buffedBySupport,
                    buffedByIdentity,
                    deathTime, 
                    frontAttackDamage,
                    backAttackDamage,
                    shieldsGiven,
                    shieldsReceived,
                    rdpsDamageReceived,
                    rdpsDamageReceivedSupport,
                    rdpsDamageGiven,
                    fight_start,
                    user
                    ) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    newEntityValues
                );
            }
        }

        res.send({
            message: "All made it"
        });
    } catch (error) {
        res.status(500).send({
            message: "Error uploading all",
            error: error.message
        });
    }
};

exports.deleteAll = async (req, res) => {
    try {
        await sqlDatabase.run('DELETE FROM entity');
        await sqlDatabase.run('DELETE FROM encounter');

        res.send({
            message: "All data deleted"
        });
    } catch (error) {
        res.status(500).send({
            message: "Error deleting data",
            error: error.message
        });
    }
};

exports.getDb = async (req, res) => {
    try {
        const user = req.user
        
        const email = await getEmail(user)

        const entityMessage = await sqlDatabase.all('SELECT * FROM entity WHERE user=? AND entity_type=?',[email, "PLAYER"]);
        const encounterMessage = await sqlDatabase.all('SELECT * FROM encounter WHERE user=?', [email]);

        res.status(200).send({
            entity: entityMessage,
            encounter: encounterMessage
        });
    } catch (error) {
        res.status(500).send({
            message: "Error retrieving data",
            error: error.message
        });
    }
};

// exports.getClearPercent = async (req, res) => {
//     try {
//         const user = req.user; // Access path parameter
        
//         const email = await getEmail(user)

//         const clearJSON = await sqlDatabase.all('SELECT cleared FROM encounter WHERE user = ?', [email]);

        
//         const lengthCleared = clearJSON.length

//         if (lengthCleared == 0) {
//             res.status(200).send({
//                 clearPercent: null
//             })
//         }

//         var didClear = 0
//         var didNotClear = 0

//         for(let i = 0; i < lengthCleared; i++) {
//             if (clearJSON[i] != null) {
//                 if (clearJSON[i] == 1) {
//                     didClear++
//                 } else {
//                     didNotClear++
//                 }
//             }
//         }

//         const clearPercent = didClear/ (didClear + didNotClear)

//         res.status(200).send({
//             clear_percent: clearPercent,
//             did_not_clear: didNotClear,
//             did_clear: didClear,
//             user: uId
//         })

        
//     } catch (error) {
//         res.status(500).send({
//             message: "error getting clear percent",
//             error: error.message // Include the error message for debugging
//         });
//     }
// };

// exports.getClearedWhenAlive = async (req,res) => {
//     try {
//         const user = req.user;
        
//         const email = await getEmail(user)

//         const dataJSON = await sqlDatabase.all('SELECT id, cleared FROM encounter WHERE user = ?', [email])

//         res.status(200).send({
//             data: dataJSON
//         })

//     } catch (error) {
//         res.status(500).send({
//             message: "error sending data",
//             error: error.message
//         })
//     }


// }

exports.getNumberOfLogs = async (req,res) => {
    try {
        const entityJSON = await sqlDatabase.all('SELECT COUNT(*) FROM entity')
        const encounterJSON = await sqlDatabase.all('SELECT COUNT(*) FROM encounter')
        const userJSON = await sqlDatabase.all('SELECT COUNT(*) FROM userinfo')

        const entJSON = entityJSON[0]["COUNT(*)"]
        const encJSON = encounterJSON[0]["COUNT(*)"]
        const useJSON = userJSON[0]["COUNT(*)"]

        res.status(200).send({
            entityCount: entJSON,
            encounterCount: encJSON,
            userCount: useJSON
        })

    } catch (error) {
        res.status(500).send({
            message: "error counting logs",
            error: error.message
        })
    }
}


