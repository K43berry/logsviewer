import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Table, Tbody, Td, Th, Thead, Tr, VStack, Text, useToast } from '@chakra-ui/react';
import DataService from '../service/service.sql';

const MyFriends = () => {
  const [receivedFriends, setReceivedFriends] = useState([]);
  const [sharedFriends, setSharedFriends] = useState([]);
  const [newFriendName, setNewFriendName] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const received = await DataService.friendsGetAllReceived();
      const shared = await DataService.friendsGetAllShared();
      setReceivedFriends(received.data.listOfFriends);
      setSharedFriends(shared.data.listOfFriends);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error fetching data.",
        description: "There was an error fetching your friends list.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const removeSharedFriend = async (friend) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this shared friend?");
    if (isConfirmed) {
      try {
        await DataService.friendsRemoveShared({ friendReceived: friend });
        fetchData();
      } catch (error) {
        console.error("Error removing shared friend:", error);
        toast({
          title: "Error removing friend.",
          description: "There was an error removing this friend.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };
  
  const removeReceivedFriend = async (friend) => {
    const isConfirmed = window.confirm("Are you sure you want to remove this received friend?");
    if (isConfirmed) {
      try {
        await DataService.friendsRemoveReceived({ friendReceived: friend });
        fetchData();
      } catch (error) {
        console.error("Error removing received friend:", error);
        toast({
          title: "Error removing friend.",
          description: "There was an error removing this friend.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const viewLogs = (friend) => {
    window.location.href = '/friendslogs?friend=' + encodeURIComponent(friend);
  };

  const addFriend = async () => {
    try {
      await DataService.friendsCreate({ friendReceived: newFriendName });
      setNewFriendName('');
      fetchData();
      toast({
        title: "Friend added.",
        description: "The friend has been added successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error adding friend:", error);
      toast({
        title: "Error adding friend.",
        description: "There was an error adding this friend.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Box p={4} maxW="1200px" mx="auto">
        <VStack spacing={4}>
          <Text fontSize="2xl" fontWeight="bold">Share Logs To:</Text>
          <Box display="flex" mb={4}>
            <Input
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              placeholder="Enter friend's username"
              mr={2}
            />
            <Button colorScheme="teal" onClick={addFriend}>Share Your Logs</Button>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Box flex="1" mr={4}>
              <Text fontSize="xl" fontWeight="bold">Received Logs From:</Text>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Friend</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {receivedFriends.map((friend, index) => (
                    <Tr key={index}>
                      <Td>{friend.friendSharedUser}</Td>
                      <Td>
                        <Button size="sm" colorScheme="red" onClick={() => removeReceivedFriend(friend.friendSharedUser)}>Remove</Button>
                        <Button size="sm" colorScheme="blue" ml={2} onClick={() => viewLogs(friend.friendSharedUser)}>View Logs</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Box flex="1">
              <Text fontSize="xl" fontWeight="bold">Shared Logs To:</Text>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Friend</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sharedFriends.map((friend, index) => (
                    <Tr key={index}>
                      <Td>{friend.friendReceivedUser}</Td>
                      <Td>
                        <Button size="sm" colorScheme="red" onClick={() => removeSharedFriend(friend.friendReceivedUser)}>Remove</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default MyFriends;
