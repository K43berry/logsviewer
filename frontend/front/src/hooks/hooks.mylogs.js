import React, { useState, useEffect } from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import NavBar from './commonHooks/commonHooks.navBar';
import StatsService from '../controller/controller.stats';
import LogsViewer from './commonHooks/commonHooks.logViewer';

const MyLogs = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const store = await StatsService.getAll();
        setData(store.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box>
      <NavBar />
      <Box p={4} maxW="1200px" mx="auto">
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Spinner size="xl" />
          </Box>
        ) : (
          data && <LogsViewer dat={data} />
        )}
      </Box>
    </Box>
  );
};

export default MyLogs;
