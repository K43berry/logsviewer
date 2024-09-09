import React from 'react';
import { Box, Flex, Link, Button, Text } from '@chakra-ui/react';

const NavBar = () => {

  const getUserData = () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = '/';
  };

  const userData = getUserData();

  return (
    <Box as="header" padding="4" bg="gray.800" color="white">
      <Flex justify="space-between" align="center">
        <Link href="/" fontSize="2xl" fontWeight="bold">
          Logs Uploader
        </Link>

        <Flex as="nav" gap="4">
          <Link href="/leaderboard">Leaderboard</Link>
          {userData && <Link href="/upload">Upload</Link>}
          {userData && <Link href="/friends">Friends</Link>}
          {userData && <Link href="/mylogs">My Logs</Link>}
          {userData && <Link href="/myrecap">My Recap (WIP)</Link>}
        </Flex>

        <Flex align="center" gap="4">
          {userData ? (
            <>
              <Text>
                Signed In As{' '}
                <Text as="span" fontWeight="bold" color="#BB86FC">
                  {userData.user}
                </Text>
              </Text>
              <Button onClick={logout} colorScheme="teal" variant="outline">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                as={Link}
                href="/signin"
                colorScheme="teal"
                variant="solid"
                _hover={{ textDecorationLine: 'none' }}  // Disable underline specifically
              >
                Sign In
              </Button>
              <Button
                as={Link}
                href="/signup"
                colorScheme="teal"
                variant="outline"
                _hover={{ textDecorationLine: 'none' }}  // Disable underline specifically
              >
                Sign Up
              </Button>
            </>
          )}
          <Link
            href="/settings"
            fontSize="2xl"
            _hover={{ textDecorationLine: 'none' }}  // Disable underline specifically
          >
            ⚙️
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default NavBar;
