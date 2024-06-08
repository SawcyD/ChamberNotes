// src/components/ChatButton.jsx
import React, { useState } from 'react';
import { IconButton, Box } from '@chakra-ui/react';
import { FaComments } from 'react-icons/fa';
import ChatWindow from './ChatWindow';

const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <Box position="fixed" bottom="20px" right="20px">
      <IconButton
        icon={<FaComments />}
        isRound
        size="lg"
        colorScheme="teal"
        onClick={toggleChat}
      />
      {isChatOpen && <ChatWindow onClose={toggleChat} />}
    </Box>
  );
};

export default ChatButton;
