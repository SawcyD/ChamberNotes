// src/components/ContextMenu.jsx
import React from 'react';
import { Box, Button, VStack } from '@chakra-ui/react';

const ContextMenu = ({ isVisible, position, onClose, onDelete }) => {
  if (!isVisible) return null;

  return (
    <Box
      position="absolute"
      top={`${position.y}px`}
      left={`${position.x}px`}
      bg="gray.700"
      borderRadius="md"
      zIndex="1000"
      boxShadow="lg"
      p={2}
    >
      <VStack align="stretch" spacing={1}>
        <Button variant="ghost" onClick={onDelete}>Delete</Button>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </VStack>
    </Box>
  );
};

export default ContextMenu;
