import React, { useState, useEffect } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, useToast } from '@chakra-ui/react';
import NavBar from './commonHooks/commonHooks.navBar';
import DataService from '../service/service.sql';

const Leaderboard = () => {
    const [data, setData] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const toast = useToast();

    useEffect(() => {
        const getLeaderboard = async () => {
            try {
                const response = await DataService.getAllLeaderboard();
                setData(response.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast({
                    title: "Error fetching leaderboard.",
                    description: "There was an error fetching the leaderboard data.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        getLeaderboard();
    }, [toast]);

    const handleSort = (columnName) => {
        if (sortBy === columnName) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(columnName);
            setSortOrder('asc');
        }
    };

    const sortedData = data ? [...data].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a[sortBy] - b[sortBy];
        } else {
            return b[sortBy] - a[sortBy];
        }
    }) : [];

    const getSortIndicator = (columnName) => {
        if (sortBy === columnName) {
            return sortOrder === 'asc' ? '↑' : '↓';
        }
        return '';
    };

    return (
        <Box>
            <NavBar />
            <Box p={4} maxW="1200px" mx="auto">
                <Text fontSize="lg" mb={4}>To filter, click on any of the headers.</Text>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>User</Th>
                            <Th onClick={() => handleSort('score')} cursor="pointer">Score {getSortIndicator('score')}</Th>
                            <Th onClick={() => handleSort('clearPercent')} cursor="pointer">Clear Percent {getSortIndicator('clearPercent')}</Th>
                            <Th onClick={() => handleSort('clearPercentAlive')} cursor="pointer">Clear Percent Alive {getSortIndicator('clearPercentAlive')}</Th>
                            <Th onClick={() => handleSort('duration')} cursor="pointer">Duration {getSortIndicator('duration')}</Th>
                            <Th onClick={() => handleSort('localDPS')} cursor="pointer">Local DPS {getSortIndicator('localDPS')}</Th>
                            <Th onClick={() => handleSort('percentDamage')} cursor="pointer">% Damage {getSortIndicator('percentDamage')}</Th>
                            <Th onClick={() => handleSort('percentDead')} cursor="pointer">% Dead {getSortIndicator('percentDead')}</Th>
                            <Th onClick={() => handleSort('logsStored')} cursor="pointer">Logs Stored {getSortIndicator('logsStored')}</Th>
                            <Th onClick={() => handleSort('uniquePlayers')} cursor="pointer">Unique Players {getSortIndicator('uniquePlayers')}</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {sortedData.map((item, index) => (
                            <Tr key={index}>
                                <Td>{item.user}</Td>
                                <Td>{Math.round(item.score)}</Td>
                                <Td>{Math.round(item.clearPercent * 100) / 10}%</Td>
                                <Td>{Math.round(item.clearPercentAlive * 100) / 10}%</Td>
                                <Td>{Math.round(item.duration / 360000) / 10} Hours</Td>
                                <Td>{Math.round(item.localDPS / 100000) / 10} M</Td>
                                <Td>{Math.round(item.percentDamage * 100) / 10}%</Td>
                                <Td>{Math.round(item.percentDead * 100) / 10}%</Td>
                                <Td>{item.logsStored}</Td>
                                <Td>{item.uniquePlayers}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Box>
    );
};

export default Leaderboard;
