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

const getClearPercentData = async (user) => {
    const cC= await sqlDatabase.all(`
        SELECT COUNT(*) AS clearedCount FROM
            (SELECT *
            FROM encounter
            JOIN entity ON encounter.fight_start = entity.fight_start
            WHERE encounter.user = ?
            AND encounter.local_player = entity.name
            )
        WHERE 
        cleared = 1`,
        [user])

    const cCA = await sqlDatabase.all(`
        SELECT COUNT(*) AS clearedCount FROM 
            (SELECT *
            FROM encounter
            JOIN entity ON encounter.fight_start = entity.fight_start
            WHERE encounter.user = ?
            AND encounter.local_player = entity.name
            )
        WHERE 
        cleared = 1 
        AND is_dead = 0`,
        [user])

    const fC = await sqlDatabase.all(`
            SELECT COUNT(*) AS failedCount FROM 
                (SELECT *
                FROM encounter
                JOIN entity ON encounter.fight_start = entity.fight_start
                WHERE encounter.user = ?
                AND encounter.local_player = entity.name
                )
            WHERE 
            cleared = 0`,
            [user])
    
    const clearCount = cC[0].clearedCount
    const clearCountAlive = cCA[0].clearedCount
    const failCount = fC[0].failedCount

    const total = clearCount + failCount

    return {clearPercent: clearCount/total, clearPercentAlive: clearCountAlive/total}
}

const getNumberOfLogs = async (user) => {

    const nE = await sqlDatabase.all(
        `SELECT COUNT(*) AS clearedCount FROM encounter WHERE user = ?`,
         [user])

    const nUE = await sqlDatabase.all(
        `SELECT COUNT(DISTINCT name) AS clearedCount FROM entity WHERE user = ?`,
        [user])

    const numberOfEncounters = nE[0].clearedCount
    const numberOfUniqueEntities = nUE[0].clearedCount

    return {numberOfEncounters: numberOfEncounters, numberOfUniqueEntities: numberOfUniqueEntities}
}

const getDamageStats = async (user) => {
    const totalDamageDealt = (await sqlDatabase.all(`
        SELECT SUM(total_damage_dealt) AS totalDamageDealt
        FROM encounter
        WHERE user = ?
        `, [user]))[0].totalDamageDealt

    const totalDamageDealtLocal = (await sqlDatabase.all(`
        SELECT SUM(damageDealt) AS totalDamageDealt FROM
            (SELECT *
            FROM encounter
            JOIN entity ON encounter.fight_start = entity.fight_start
            WHERE encounter.user = ?
            AND encounter.local_player = entity.name
            )
        `, [user]))[0].totalDamageDealt

    const totalDPS = (await sqlDatabase.all(`
        SELECT AVG(total_dps) AS totalDamageDealt
        FROM encounter
        WHERE user = ?
        `, [user]))[0].totalDamageDealt

    const totalDPSLocal = (await sqlDatabase.all(`
        SELECT AVG(dps) AS totalDamageDealt FROM
            (SELECT *
            FROM encounter
            JOIN entity ON encounter.fight_start = entity.fight_start
            WHERE encounter.user = ?
            AND encounter.local_player = entity.name
            )
        `, [user]))[0].totalDamageDealt

    const totalDamageTaken = (await sqlDatabase.all(`
        SELECT SUM(damageTaken) AS totalDamageDealt FROM
            (SELECT *
            FROM encounter
            JOIN entity ON encounter.fight_start = entity.fight_start
            WHERE encounter.user = ?
            )
        `, [user]))[0].totalDamageDealt

    const totalDamageTakenLocal = (await sqlDatabase.all(`
        SELECT SUM(damageTaken) AS totalDamageDealt FROM
            (SELECT *
            FROM encounter
            JOIN entity ON encounter.fight_start = entity.fight_start
            WHERE encounter.user = ?
            AND encounter.local_player = entity.name
            )
        `, [user]))[0].totalDamageDealt

    return {
        totalDamageDealt: totalDamageDealt,
        totalDamageDealtLocal: totalDamageDealtLocal,
        totalDPS: totalDPS,
        totalDPSLocal: totalDPSLocal,
        totalDamageTaken: totalDamageTaken,
        totalDamageTakenLocal: totalDamageTakenLocal,
    }
}

const getNumberOfBossFights = async (user) => {

    const result = await sqlDatabase.all(
        `SELECT current_boss, COUNT(*) AS frequency
        FROM encounter
        WHERE user = ?
        GROUP BY current_boss
        ORDER BY frequency DESC`,
    [user])

    return {
        numberOfBossFights: result
    }

}

const getLogsPerLocalPlayer = async (user) => {

    const result = await sqlDatabase.all(
        `SELECT local_player, COUNT(*) AS frequency
        FROM encounter
        WHERE user = ?
        GROUP BY local_player
        ORDER BY frequency DESC`,
    [user])

    return {
        logsPerLocalPlayer: result
    }

}

const getDeathTime = async (user) => {

    const totalDeathTimeLocal = (await sqlDatabase.all(`
        SELECT SUM(duration - (deathTime-fight_start)) AS totalDamageDealt FROM
            (SELECT *
            FROM encounter
            JOIN entity ON encounter.fight_start = entity.fight_start
            WHERE encounter.user = ?
            AND encounter.local_player = entity.name
			AND entity.deathTime != 0
            )
        `, [user]))[0].totalDamageDealt

    const totalDeathTime = (await sqlDatabase.all(`
        SELECT SUM(duration - (deathTime-fight_start)) AS totalDamageDealt FROM
            (SELECT *
            FROM encounter
            JOIN entity ON encounter.fight_start = entity.fight_start
            WHERE encounter.user = ?
            AND entity.deathTime != 0
            )
    `, [user]))[0].totalDamageDealt

    return {
        localDeathTime: totalDeathTimeLocal,
        deathTime: totalDeathTime
    }

}

const getTotalDuration = async (user) => {
    
    const totalDuration = (await sqlDatabase.all(`
        SELECT SUM(duration) AS totalDamageDealt FROM
            (SELECT *
            FROM encounter
            JOIN entity ON encounter.fight_start = entity.fight_start
            WHERE encounter.user = ?
            AND encounter.local_player = entity.name
            )
        `, [user]))[0].totalDamageDealt
    
    return {
        totalDuration: totalDuration
    }

}

const getAverageGearScore = async (user) => {

    const avgGearScore = (await sqlDatabase.all(`
        SELECT AVG(gear_score) AS totalDamageDealt FROM
            (SELECT *
            FROM encounter
            JOIN entity ON encounter.fight_start = entity.fight_start
            WHERE encounter.user = ?
            )
        `, [user]))[0].totalDamageDealt

    return {
        averageGearScore: avgGearScore
    }

}

const getClassDist = async (user) => {

    const classDist = await sqlDatabase.all(`
    SELECT class, COUNT(*) AS frequency FROM (
		SELECT *
            FROM encounter
            JOIN entity ON encounter.fight_start = entity.fight_start 
            WHERE encounter.user = ?
		)
        GROUP BY class
        ORDER BY frequency DESC
    `, [user])

    return {
        classDist: classDist
    }

}


exports.getRecap = async (req, res) => {
    try {
        const userZ = req.user
        const user = await getEmail(userZ)

        const getClearPercentDataA = await getClearPercentData(user)
        const getNumberOfLogsA = await getNumberOfLogs(user)
        const getDamageStatsA = await getDamageStats(user)
        const getNumberOfBossFightsA = await getNumberOfBossFights(user)
        const getLogsPerLocalPlayerA = await getLogsPerLocalPlayer(user)
        const getDeathTimeA = await getDeathTime(user)
        const getTotalDurationA = await getTotalDuration(user)
        const getAverageGearScoreA = await getAverageGearScore(user)
        const getClassDistA = await getClassDist(user)
        
        const data = {
            getClearPercentData: getClearPercentDataA,
            getNumberOfLogs: getNumberOfLogsA,
            getDamageStats: getDamageStatsA,
            getNumberOfBossFights: getNumberOfBossFightsA,
            getLogsPerLocalPlayer: getLogsPerLocalPlayerA,
            getDeathTime: getDeathTimeA,
            getTotalDuration: getTotalDurationA,
            getAverageGearScore: getAverageGearScoreA,
            getClassDist: getClassDistA,
        }

        res.status(200).send({
            data: data
        })
        
        
    } catch (error) {
        res.status(403).send({
            message: "error getting recap",
            error: error
        })
    }
}

exports.sendToLeaderboard = async (req, res) => {
    try {
        const user = req.user

        const body = await req.body

        const data = [
            user,
            body.dateUploaded,
            body.score,
            body.clearPercent,
            body.clearPercentAlive,
            body.duration,
            body.localDamage,
            body.localDPS,
            body.percentDamage,
            body.percentDead,
            body.logsStored,
            body.uniquePlayers
        ]

        await sqlDatabase.run(`INSERT OR IGNORE INTO leaderboard 
            (user,
            dateUploaded,
            score,
            clearPercent,
            clearPercentAlive,
            duration,
            localDamageDealt,
            localDPS,
            percentDamage,
            percentDead,
            logsStored,
            uniquePlayers
            )
            VALUES
            (?,?,?,?,?,?,?,?,?,?,?,?)
            `, data)
        
        res.status(200).send({
            message: "send to leaderboard"
        })
    } catch (error) {
        res.status(403).send({
            message: "error sending to leaderboard",
            error: error
        })
    }
}

exports.getAllLeaderboard = async(req,res) => {
    try {
        const data = await sqlDatabase.all(`
            SELECT * FROM leaderboard
            `)
        
        res.status(200).send({
            data: data
        })
    } catch (error) {
        res.status(403).send({
            message: "error getting all from leaderboard",
            error:error
        })
    }

}