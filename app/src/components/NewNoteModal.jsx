// src/components/NewNoteModal.jsx
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  useDisclosure,
} from '@chakra-ui/react';

const NewNoteModal = ({ isOpen, onClose, onSave }) => {
  const [noteTitle, setNoteTitle] = useState('');

  const handleSave = () => {
    if (noteTitle.trim() !== '') {
      onSave(noteTitle);
      setNoteTitle('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Note</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Enter note title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewNoteModal;
