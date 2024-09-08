import React, { useState } from 'react';
import controllerSql from '../controller/controller.upload';
import NavBar from './commonHooks/commonHooks.navBar';
import { Box, Flex, Button, Text, Input } from '@chakra-ui/react';

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const parseDb = async () => {
    try {
      if (!selectedFile) {
        setMessage('No file selected');
        return;
      }

      if (await controllerSql(selectedFile)) {
        setMessage('Parse Successful');
        window.location.href = '/mylogs';
      }
    } catch (error) {
      setMessage("Some error occurred");
    }
  };

  const getUserData = () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };

  const userData = getUserData();

  return (
    <Box className="upload-container-navbar">
      <Box width="100%" bg="gray.800" color="white">
        <NavBar />
      </Box>

      <Box className="upload-container" padding="4" maxWidth="800px" margin="auto" mt="8">
        <Box
          className="upload-content"
          padding="6"
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="md"
        >
          <Box className="upload-content-box" mb="6">
            <Text fontWeight="bold">
              Upload the encounters.db file in your Loa Logs directory.
            </Text>
            <Text mt="4">
              <Text as="b">1. In Loa Logs:</Text> Settings &gt; Database &gt; Database Folder Open &gt; encounters.db
            </Text>
          </Box>

          {userData ? (
            <Flex direction="column" align="center" gap="4">
              <Button as="label" htmlFor="file-upload" colorScheme="teal" variant="solid" cursor="pointer">
                Choose File
              </Button>
              <Input
                type="file"
                id="file-upload"
                display="none"
                onChange={handleFileChange}
                className="file-input"
              />
              <Button colorScheme="blue" onClick={parseDb}>
                Parse DB
              </Button>
              <Text className="selected-file" mt="4">
                {selectedFile ? selectedFile.name : 'No file selected'}
              </Text>
            </Flex>
          ) : (
            <Box className="upload-content-box" mt="4">
              <Text>Must be signed in to parse data</Text>
            </Box>
          )}

          {message && (
            <Box className="upload-content-box" mt="4">
              <Text>{message}</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Upload;
