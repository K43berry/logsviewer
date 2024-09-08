import React, { useState, useEffect } from 'react';
import NavBar from './commonHooks/commonHooks.navBar';
import DataService from '../service/service.sql';
import LogsViewer from './commonHooks/commonHooks.logViewer';

const FriendsLogs = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);  // Added loading state
    const [error, setError] = useState(null);      // Added error state

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Extract the friend's username from the query parameters
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const username = urlParams.get('friend');

                if (!username) {
                    throw new Error('No friend specified in the query parameters.');
                }

                // Fetch the data from the service
                const response = await DataService.friendsGetDb({ friendReceived: username });
                setData(response.data);  // Set the retrieved data
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load friend\'s logs.');  // Set error message
            } finally {
                setLoading(false);  // Set loading state to false after fetch completes
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures this runs once on component mount

    if (loading) {
        return <div>Loading...</div>;  // Display a loading message
    }

    if (error) {
        return <div>{error}</div>;  // Display error message if there's an error
    }

    return (
        <>
            <NavBar />
            {data ? <LogsViewer dat={data} /> : <div>No logs available.</div>}  {/* Display logs if data exists */}
        </>
    );
};

export default FriendsLogs;
