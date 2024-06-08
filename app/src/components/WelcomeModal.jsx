import React, { useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, VStack, Text, Select } from '@chakra-ui/react';
import { open } from '@tauri-apps/api/dialog';

const WelcomeModal = ({ isOpen, onClose, onOpenRecent, onCreateNew }) => {
  const handleCreateNew = async () => {
    const selectedPath = await open({
      directory: true,
      multiple: false,
      title: "Select Directory for New Chamber",
    });
    if (selectedPath) {
      onCreateNew(selectedPath);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Button colorScheme="teal" onClick={handleCreateNew}>
              Create New Chamber
            </Button>
            <Button colorScheme="teal" onClick={onOpenRecent}>
              Open Recent Chamber
            </Button>
            <Select placeholder="Select recent chamber">
              {/* Add options for recent chambers */}
            </Select>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WelcomeModal;
