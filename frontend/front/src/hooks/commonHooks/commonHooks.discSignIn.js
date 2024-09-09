import React from 'react';
import { Button } from '@chakra-ui/react';
import config from '../../config.js'


const DiscSignIn = () => {
  const handleDiscordSignIn = () => {
    window.location.href = config.DISCORD_API_LINK;
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
