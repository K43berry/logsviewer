import React from 'react';
import { Button } from '@chakra-ui/react';

const DiscSignIn = () => {
  const handleDiscordSignIn = () => {
    window.location.href =
      'https://discord.com/oauth2/authorize?client_id=1248348018202378273&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fdiscord%2Fauth&scope=email+identify'; // Example URL for Discord OAuth
  };

  return (
    <Button
      onClick={handleDiscordSignIn}
      colorScheme="purple"
      variant="solid"
      size="lg"
      mt="4"
    >
      Sign in with Discord
    </Button>
  );
};

export default DiscSignIn;
