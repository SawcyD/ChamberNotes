// src/components/ChatWindow.jsx
import React, { useState } from 'react';
import { Box, Button, Textarea, VStack, Text, HStack } from '@chakra-ui/react';

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Simulate a bot response
      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, { text: 'Hello! How can I help you?', sender: 'bot' }]);
      }, 1000);
    }
  };

  return (
    <Box
      position="fixed"
      bottom="80px"
      right="20px"
      bg="gray.800"
      color="white"
      p={4}
      borderRadius="md"
      boxShadow="lg"
      width="300px"
      maxHeight="400px"
      overflowY="auto"
    >
      <VStack spacing={3}>
        <Box width="100%">
          <HStack justifyContent="space-between">
            <Text fontSize="lg">Chat</Text>
            <Button size="xs" onClick={onClose}>Close</Button>
          </HStack>
        </Box>
        <Box flex={1} width="100%" overflowY="auto">
          {messages.map((message, index) => (
            <Box
              key={index}
              bg={message.sender === 'user' ? 'teal.500' : 'gray.700'}
              p={2}
              borderRadius="md"
              alignSelf={message.sender === 'user' ? 'flex-end' : 'flex-start'}
            >
              <Text>{message.text}</Text>
            </Box>
          ))}
        </Box>
        <HStack width="100%">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            size="sm"
          />
          <Button onClick={sendMessage} colorScheme="teal">
            Send
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ChatWindow;
