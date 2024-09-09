import React, { useState, useEffect } from 'react';
import { Box, Heading, Text} from '@chakra-ui/react';
import StatsController from '../controller/controller.stats';

const App = () => {
  const [logsStored, setLogsStored] = useState(null);

  const getData = async () => {
    console.log(process.env.BACKEND_API_LINK)

    const response = await StatsController.getNumberOfLogs();
    const data = response.data;
    setLogsStored(data.entityCount + data.encounterCount);
  };

  useEffect(() => {
    getData();
  }, []); 


  return (

    <Box className="app-container" padding="4" maxWidth="full" margin="auto">

      <Box as="main" textAlign="center" mt={8}>
        <Heading as="h1" size="3xl" mb={4}>
          LOST ARK <Box as="span" textDecoration="underline">LOGS</Box>
          <br />
          UPLOADER
        </Heading>
        <Text fontSize="3xl" mb={8}>
          Over {logsStored} logs stored
        </Text>
      </Box>
    </Box>
  );
};

export default App;
