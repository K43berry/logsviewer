import React, { useState, useEffect } from 'react';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Heading, Text} from '@chakra-ui/react';
import DataService from '../service/service.sql';

const MyRecap = () => {
  const [data, setData] = useState(null);
  const [expandedClass, setExpandedClass] = useState(false);
  /*const [expandedPlayer, setExpandedPlayer] = useState(false);
  const [expandedBoss, setExpandedBoss] = useState(false);*/

  const toggleExpandClass = () => {
    setExpandedClass(!expandedClass);
  };

  /*
  const toggleExpandPlayer = () => {
    setExpandedPlayer(!expandedPlayer);
  };

  const toggleExpandBoss = () => {
    setExpandedBoss(!expandedBoss);
  };*/

  const calcScore = () => {
    let baseScore = data.getTotalDuration.totalDuration / 1000000;
    baseScore *= data.getAverageGearScore.averageGearScore;
    baseScore *= (data.getNumberOfLogs.numberOfEncounters + data.getNumberOfLogs.numberOfUniqueEntities);
    baseScore *= data.getClearPercentData.clearPercent;
    baseScore *= Math.pow(100, data.getClearPercentData.clearPercentAlive);
    baseScore *= (data.getDamageStats.totalDamageDealtLocal / data.getDamageStats.totalDamageDealt);
    baseScore *= (1 - (data.getDeathTime.localDeathTime / data.getDeathTime.deathTime));

    return baseScore;
  };

  useEffect(() => {
    const getRecap = async () => {
      try {
        const store = await DataService.getRecap();
        setData(store.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getRecap();
  }, []);

  const sendToLeaderboard = () => {
    const newDate = new Date().getTime();
    const leaderboardData = {
      dateUploaded: newDate,
      score: calcScore(),
      clearPercent: data.getClearPercentData.clearPercent,
      clearPercentAlive: data.getClearPercentData.clearPercentAlive,
      duration: data.getTotalDuration.totalDuration,
      localDamage: data.getDamageStats.totalDamageDealtLocal,
      localDPS: data.getDamageStats.totalDPSLocal,
      percentDamage: (data.getDamageStats.totalDamageDealtLocal / data.getDamageStats.totalDamageDealt),
      percentDead: (data.getDeathTime.localDeathTime / data.getDeathTime.deathTime),
      logsStored: data.getNumberOfLogs.numberOfEncounters,
      uniquePlayers: data.getNumberOfLogs.numberOfUniqueEntities
    };
    DataService.sendToLeaderboard(leaderboardData);
  };

  const goToLeaderboard = async () => {
    sendToLeaderboard();
    window.location.href = 'http://localhost:8081/leaderboard';
  };

  return (
    data && (
      <Box className="app-container" p={4}>
        <Box className="recap-container" p={8} maxW="800px" mx="auto" borderWidth={1} borderRadius="lg" boxShadow="lg">
          <Heading mb={4}>Your Lost Ark Recapped</Heading>
          <Text fontSize="lg" mb={4}>
            Total Time In Raids: {Math.round(data.getTotalDuration.totalDuration / 360000) / 10} hours
          </Text>
          <Text fontSize="lg" mb={4}>
            You had a total of {data.getNumberOfLogs.numberOfEncounters} logs stored meeting {data.getNumberOfLogs.numberOfUniqueEntities} unique players!
          </Text>

          {data.getClassDist.classDist.length > 3 && (
            <Button onClick={toggleExpandClass} mb={4} colorScheme="teal">
              {expandedClass ? 'Show less' : 'Show more'}
            </Button>
          )}

          <Box mb={6}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Class</Th>
                  <Th>Frequency</Th>
                </Tr>
              </Thead>
              <Tbody>
                {expandedClass
                  ? data.getClassDist.classDist.map((classData, index) => (
                      <Tr key={index}>
                        <Td>{classData.class}</Td>
                        <Td>{classData.frequency}</Td>
                      </Tr>
                    ))
                  : data.getClassDist.classDist.slice(0, 3).map((classData, index) => (
                      <Tr key={index}>
                        <Td>{classData.class}</Td>
                        <Td>{classData.frequency}</Td>
                      </Tr>
                    ))}
              </Tbody>
            </Table>
          </Box>

          <Text fontSize="lg" mb={4}>
            Average Gear Score Overall: {Math.round(data.getAverageGearScore.averageGearScore)}
          </Text>
          <Text fontSize="lg" mb={4}>
            You cleared {Math.round(data.getClearPercentData.clearPercent * 1000) / 10}% of encounters
          </Text>
          <Text fontSize="lg" mb={4}>
            However, you were only alive for {Math.round(data.getClearPercentData.clearPercentAlive * 1000) / 10}% of encounter clears
          </Text>
          
          {/* More data display... (Similar refactoring can be applied for player logs and boss fight tables) */}

          <Button onClick={goToLeaderboard} colorScheme="teal" mt={4}>
            Check Where You Place On The Leaderboard!
          </Button>
        </Box>
      </Box>
    )
  );
};

export default MyRecap;
