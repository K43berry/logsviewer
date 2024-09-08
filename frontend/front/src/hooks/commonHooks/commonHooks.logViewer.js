import React, { useState, useEffect, useCallback } from 'react';
import { Box, Input, Button, Table, Thead, Tbody, Tr, Th, Td, Text, Flex, VStack } from '@chakra-ui/react';
import Encounter from './commonHooks.encounter';

const LogsViewer = ({ dat }) => {
    const [data, setData] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [nameFilter, setNameFilter] = useState("");
    const [classFilter, setClassFilter] = useState("");
    const [bossFilter, setBossFilter] = useState("");
    const [timeFilter, setTimeFilter] = useState(0);
    const [dpsFilter, setDpsFilter] = useState(false);

    useEffect(() => {
        setData(dat);
        setFilteredData(dat);
    }, [dat]);
    
    const getLocalPlayerDps = useCallback((encounter) => {
        const entitiesForEncounter = data.entity.filter(z => z.fight_start === encounter.fight_start);
        const localPlayerEntity = entitiesForEncounter.find(z => z.name === encounter.local_player);
        return localPlayerEntity ? localPlayerEntity.dps : null;
    }, [data]);

    const checkForName = useCallback((encounter, name) => {
        const entitiesForEncounter = data.entity.filter(z => z.fight_start === encounter.fight_start);
        return entitiesForEncounter.some(z => z.name.toLowerCase().includes(name));
    }, [data]);

    const checkForClass = useCallback((encounter, clas) => {
        const entitiesForEncounter = data.entity.filter(z => z.fight_start === encounter.fight_start);
        return entitiesForEncounter.some(z => z.class.toLowerCase().includes(clas));
    }, [data]);

    const compareDps = useCallback((a, b) => {
        const aDps = getLocalPlayerDps(a);
        const bDps = getLocalPlayerDps(b);

        if (aDps != null && bDps != null) {
            return bDps - aDps;
        } else if (aDps != null) {
            return -1;
        } else if (bDps != null) {
            return 1;
        } else {
            return 0;
        }
    }, [getLocalPlayerDps]);

    const filterArrayByString = useCallback((arr, str) => {
        const lowerCaseStr = str.toLowerCase();
        return arr.filter(element => checkForName(element, lowerCaseStr));
    }, [checkForName]);

    const filterArrayByBoss = useCallback((arr, str) => {
        const lowerCaseStr = str.toLowerCase();
        return arr.filter(element => element.current_boss.toLowerCase().includes(lowerCaseStr));
    }, []);

    const filterArrayByTime = useCallback((arr, int) => {
        return arr.filter(element => (element.duration / 1000) > int);
    }, []);

    const filterArrayByClass = useCallback((arr, str) => {
        const lowerCaseStr = str.toLowerCase();
        return arr.filter(element => checkForClass(element, lowerCaseStr));
    }, [checkForClass]);

    const filtering = useCallback(() => {
        if (!data) return;

        let newEncounter = [...data.encounter];
        if (dpsFilter) {
            newEncounter.sort(compareDps);
        }
        if (nameFilter) {
            newEncounter = filterArrayByString(newEncounter, nameFilter);
        }
        if (bossFilter) {
            newEncounter = filterArrayByBoss(newEncounter, bossFilter);
        }
        if (timeFilter > 0) {
            newEncounter = filterArrayByTime(newEncounter, timeFilter);
        }
        if (classFilter) {
            newEncounter = filterArrayByClass(newEncounter, classFilter);
        }

        const newData = {
            entity: [...data.entity],
            encounter: newEncounter,
        };

        setFilteredData(newData);
    }, [data, classFilter, dpsFilter, nameFilter, bossFilter, timeFilter, compareDps, filterArrayByClass, filterArrayByString, filterArrayByBoss, filterArrayByTime]);

    useEffect(() => {
        filtering();
    }, [nameFilter, bossFilter, timeFilter, dpsFilter, filtering]);

    return (
        <Box className="logs-container" p={4}>
            <VStack spacing={4} align="stretch">
                <Box className="filter-container" p={4} borderWidth={1} borderRadius="md" boxShadow="md">
                    {/* Filter elements */}
                    <Flex direction="column" gap={4}>
                        <Input
                            placeholder="Filter by player name"
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                        />
                        <Input
                            placeholder="Filter by boss"
                            value={bossFilter}
                            onChange={(e) => setBossFilter(e.target.value)}
                        />
                        <Input
                            placeholder="Filter by class"
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                        />
                        <Input
                            type="number"
                            placeholder="Min duration (Seconds)"
                            min="0"
                            step={30}
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(parseInt(e.target.value, 10) || 0)}
                        />
                        <Button
                            colorScheme={dpsFilter ? "teal" : "gray"}
                            onClick={() => setDpsFilter(!dpsFilter)}
                        >
                            Toggle DPS Filter
                        </Button>
                    </Flex>
                </Box>
                <Box className="table-container">
                    <Table variant="simple" mt={4}>
                        <Thead>
                            <Tr>
                                <Th>Encounter</Th>
                                <Th>Local User</Th>
                                <Th>My DPS</Th>
                                <Th>Date</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredData && filteredData.encounter && filteredData.encounter.map((encounter, index) => {
                                const entitiesForEncounter = filteredData.entity.filter(entity => entity.fight_start === encounter.fight_start);
                                return (
                                    <Encounter
                                        key={index}
                                        local_user={encounter.local_player}
                                        encounter={encounter.current_boss}
                                        clear={encounter.cleared}
                                        date={encounter.fight_start}
                                        difficulty={encounter.difficulty}
                                        entities_array={entitiesForEncounter}
                                        party_info={JSON.parse(encounter.party_info)}
                                    />
                                );
                            })}
                        </Tbody>
                    </Table>
                </Box>
                <Text color="gray.500" textAlign="center">
                    Refresh the page on first upload if logs are not showing.
                </Text>
            </VStack>
        </Box>
    );
};

export default LogsViewer;
