import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, Text, Link, VStack, Flex } from '@chakra-ui/react';
import loginService from '../controller/controller.login';
import NavBar from './commonHooks/commonHooks.navBar'; 
import DiscSignIn from './commonHooks/commonHooks.discSignIn';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      const response = await loginService.signin(username, password);
      if (response) {
        setMessage('Sign-in successful!');
        window.location.href = '/';
      } else {
        setMessage('Sign-in failed. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <Box className="app-container">
      <NavBar /> {/* Render NavBar */}
      <Flex justify="center" align="center" mt="8" flexDirection="column">
        <Box className="signin-container" p="8" borderWidth="1px" borderRadius="lg" boxShadow="md" width="100%" maxWidth="400px">
          <form onSubmit={handleSignIn}>
            <VStack spacing="4">
              <FormControl id="username" isRequired>
                <FormLabel>Username:</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password:</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </FormControl>
              <Link href="/forgotpassword" color="teal.500" alignSelf="flex-end">
                Forgot password?
              </Link>
              <Button type="submit" colorScheme="teal" width="full">
                Log In
              </Button>
            </VStack>
          </form>
          {message && (
            <Box className="message-box" mt="4">
              <Text color={message.includes('successful') ? 'green.500' : 'red.500'}>{message}</Text>
            </Box>
          )}
        </Box>
        <Text mt="4">
          New?{' '}
          <Link href="/signup" color="teal.500">
            Register Here!
          </Link>
        </Text>
        <DiscSignIn />
      </Flex>
    </Box>
  );
};

export default SignIn;
