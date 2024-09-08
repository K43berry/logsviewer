import React, { useState } from 'react';
import { Box, FormControl, FormLabel, Input, Button, Text, VStack, Flex } from '@chakra-ui/react';
import loginService from '../controller/controller.login';
import NavBar from './commonHooks/commonHooks.navBar'; // Import NavBar component
import DiscSignIn from './commonHooks/commonHooks.discSignIn';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async (event) => {
    event.preventDefault();

    // Email validation using regex
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setMessage('Invalid email address.');
      return;
    }

    try {
      const response = await loginService.signup(username, password, email);
      if (response.status) {
        setMessage('Sign-up successful!');
      } else {
        setMessage('An error occurred. Please try again.');
      }
    } catch (error) {
      if (error.response.status === 400) {
        setMessage('Username is taken. Please try again.');
      } else {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <Box className="app-container">
      <NavBar /> 
      <Flex justify="center" align="center" mt="8" flexDirection="column">
        <Box className="signin-container" p="8" borderWidth="1px" borderRadius="lg" boxShadow="md" width="100%" maxWidth="400px">
          <form onSubmit={handleSignUp}>
            <VStack spacing="4">
              <FormControl id="email" isRequired>
                <FormLabel>Email:</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </FormControl>
              <FormControl id="username" isRequired>
                <FormLabel>Username:</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password:</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a password"
                />
              </FormControl>
              <Button type="submit" colorScheme="teal" width="full">
                Sign Up
              </Button>
            </VStack>
          </form>
          {message && (
            <Box className="message-box" mt="4">
              <Text color={message.includes('successful') ? 'green.500' : 'red.500'}>{message}</Text>
            </Box>
          )}
        </Box>
        <DiscSignIn />
      </Flex>
    </Box>
  );
};

export default SignUp;
