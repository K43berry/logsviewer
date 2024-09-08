import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td,} from '@chakra-ui/react';

const Entity = ({ entities_array }) => {
    return (
        <Box className="entity-table-container" p={4} borderWidth={1} borderRadius="md" boxShadow="md">
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
                    {entities_array.map((entity, index) => (
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
    );
};

export default Entity;
