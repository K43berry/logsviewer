import serviceSql from '../service/service.sql';

const getAll = () => {
    return serviceSql.getAll()
}

const getNumberOfLogs = () => {
    return serviceSql.getNumberOfLogs()
}

const StatsService = {
    getAll,
    getNumberOfLogs
}

export default StatsService