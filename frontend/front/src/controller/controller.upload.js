import loadSqlJs from './controller.sqlLoader.js'; // Make sure to use the correct path
import serviceSql from '../service/service.sql';

const controllerSql = async (file) => {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        // Load SQL.js
        const SQL = await loadSqlJs();

        // Create a promise to handle FileReader
        const db = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const arrayBuffer = event.target.result;
                    const uint8Array = new Uint8Array(arrayBuffer);
                    const dbInstance = new SQL.Database(uint8Array);
                    resolve(dbInstance);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });

        // Example of querying data from the database
        const reqEncounter = db.exec(`
            SELECT
                id,
                fight_start,
                local_player,
                current_boss,
                duration,
                total_damage_dealt,
                top_damage_dealt,
                dps,
                misc,
                difficulty,
                cleared    
            FROM encounter
        `);

        const reqEntity = db.exec(`
            SELECT
                name,
                character_id,
                encounter_id,
                npc_id,
                entity_type,
                class_id,
                class,
                gear_score,
                max_hp,
                is_dead,
                damage_stats,
                dps
            FROM entity
            WHERE entity_type = 'PLAYER'
        `);

        // Process the entity data
        const newEntity = reqEntity[0].values.map(curr => {
            const damageStats = JSON.parse(curr[10]);
            return [
                curr[0], // name
                curr[1], // character_id
                curr[2], // encounter_id
                curr[3], // npc_id
                curr[4], // entity_type
                curr[5], // class_id
                curr[6], // class
                curr[7], // gear_score
                curr[8], // max_hp
                curr[9], // is_dead
                curr[11], // dps
                ...[
                    damageStats.damageDealt,
                    damageStats.damageTaken,
                    damageStats.debuffedBySupport,
                    damageStats.buffedBySupport,
                    damageStats.buffedByIdentity,
                    damageStats.deathTime,
                    damageStats.frontAttackDamage,
                    damageStats.backAttackDamage,
                    damageStats.shieldsGiven,
                    damageStats.shieldsReceived,
                    damageStats.rdpsDamageReceived,
                    damageStats.rdpsDamageReceivedSupport,
                    damageStats.rdpsDamageGiven
                ]
            ];
        });

        const newEncounter = reqEncounter[0].values.map(curr => {
            const partyInfo = JSON.parse(curr[8]);
            return [
                curr[0], // id
                curr[1], // fight_start
                curr[2], // local_player
                curr[3], // current_boss
                curr[4], // duration
                curr[5], // total_damage_dealt
                curr[6], // top_damage_dealt
                curr[7], // dps
                curr[9], // difficulty
                curr[10], // cleared
                partyInfo // party_info
            ];
        });

        // Prepare the final data to send
        const listAll = JSON.stringify({
            entity: newEntity,
            encounter: newEncounter
        });

        await serviceSql.sendAll(listAll);

        return true;

    } catch (error) {
        console.error('Error in ControllerSql:', error);
        return false;
    }
};

export default controllerSql;
