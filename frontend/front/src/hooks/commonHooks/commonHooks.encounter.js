import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Collapse, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast } from '@chakra-ui/react';
import Entity from './commonHooks.entity';

const Encounter = ({ local_user, encounter, difficulty, clear, date, entities_array, party_info }) => {
    const [entityVisible, setEntityVisible] = useState(false);
    const [partySort, setPartySort] = useState(false);
    const [arr, setArr] = useState([]);
    //const { isOpen, onToggle } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        setArr(entities_array);
    }, [entities_array]);

    const formatTimestamp = (timestamp) => {
        var a = new Date(timestamp);

        let options = {
            year: "numeric",
            month: "short",
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'UTC'
        };
        let formatter = new Intl.DateTimeFormat('en-US', options);
        let formattedTime = formatter.format(a);

        return formattedTime;
    };

    const convertToAbbreviation = (number) => {
        const formatter = new Intl.NumberFormat('en', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumSignificantDigits: 3
        });
        
        return formatter.format(number);
    };

    let dps = ''; // Initialize DPS

    // Check if any entity has the same name as local_user
    const localPlayerEntity = entities_array.find(entity => entity.name === local_user);

    if (localPlayerEntity) {
        dps = convertToAbbreviation(localPlayerEntity.dps); // Set DPS if found
    }

    const sortByDps = (a, b) => {
        return b.dps - a.dps;
    };

    const getCleared = () => {
        return clear === 1 ? '' : '💀';
    };

    const handlePartySort = () => {
        setPartySort(!partySort);
        toast({
            title: "Sorting",
            description: partySort ? "Sorted by DPS" : "Sorted by Party",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
    };

    const actualPartySort = useCallback((x) => {
        if (!party_info) return x;
        
        let sortedEntities = [];
        let partyCount = 1;

        // Iterate over each party in party_info
        for (const key in party_info) {
            if (party_info.hasOwnProperty(key)) {
                // Add "Party #" entry before each party
                sortedEntities.push({ class: `Party ${partyCount}` });
                partyCount++;

                // Get entities for the current party
                const partyEntities = party_info[key].map(name => entities_array.find(entity => entity.name === name));
                // Sort entities by DPS
                partyEntities.sort(sortByDps);
                // Add sorted entities to the list
                sortedEntities.push(...partyEntities);
            }
        }

        return sortedEntities;
    }, [party_info, entities_array]);

    const doPartySort = useCallback(() => {
        let newArr = [...entities_array];
        if (partySort) {
            newArr = actualPartySort(newArr);
        } else {
            newArr = newArr.sort(sortByDps);
        }
        setArr(newArr);
    }, [actualPartySort, partySort, entities_array]);

    useEffect(() => {
        doPartySort();
    }, [doPartySort]);

    const toggleEntityVisibility = () => {
        setEntityVisible(!entityVisible);
    };

    return (
        <Box>
            <Tr onClick={toggleEntityVisibility} cursor="pointer" bg={entityVisible ? 'gray.100' : 'white'}>
                <Td>{encounter} {difficulty ? `[${difficulty}]` : ''} {getCleared()}</Td>
                <Td>{local_user}</Td>
                <Td>{dps}</Td>
                <Td>{formatTimestamp(date)}</Td>
            </Tr>
            <Button mt={2} onClick={handlePartySort} colorScheme={partySort ? 'teal' : 'gray'}>{partySort ? "Sort by DPS" : "Sort by Party"}</Button>
            <Collapse in={entityVisible}>
                <Box mt={4}>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Class [Gear Score]</Th>
                                <Th>Name</Th>
                                <Th>DPS</Th>
                                <Th>Brand%</Th>
                                <Th>Buff%</Th>
                                <Th>Iden%</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {arr.map((entity, index) => (
                                <Tr key={index}>
                                    <Td>{entity.class} {entity.gear_score ? `[${Math.round(entity.gear_score)}]` : ''}</Td>
                                    <Td>{entity.name}</Td>
                                    <Td>{entity.dps ? `${Math.round(entity.dps / 10000) / 100} M` : ''}</Td>
                                    <Td>{entity.damageDealt ? `${Math.round((entity.buffedBySupport / entity.damageDealt) * 100)}%` : ''}</Td>
                                    <Td>{entity.damageDealt ? `${Math.round((entity.debuffedBySupport / entity.damageDealt) * 100)}%` : ''}</Td>
                                    <Td>{entity.damageDealt ? `${Math.round((entity.buffedByIdentity / entity.damageDealt) * 100)}%` : ''}</Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </Box>
            </Collapse>
        </Box>
    );
};

export default Encounter;
