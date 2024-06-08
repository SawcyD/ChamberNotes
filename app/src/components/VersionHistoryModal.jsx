import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, VStack, Text } from '@chakra-ui/react';
import { invoke } from '@tauri-apps/api/tauri';
import { documentDir } from '@tauri-apps/api/path';

const VersionHistoryModal = ({ isOpen, onClose, noteId, notes, setNotes }) => {
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);

  useEffect(() => {
    if (noteId) {
      loadVersions(noteId);
    }
  }, [noteId]);

  const loadVersions = async (noteId) => {
    try {
      const note = notes.find((note) => note.id === noteId);
      const documentsDir = await documentDir();
      const versionFiles = await invoke('list_versions', { path: `${documentsDir}/MyNotes/${note.title}.md`.replace(/\\/g, '/') });
      setVersions(versionFiles);
    } catch (error) {
      console.error('Failed to load versions:', error);
    }
  };

  const handleRestoreVersion = async (version) => {
    try {
      const documentsDir = await documentDir();
      const content = await invoke('load_file', { path: `${documentsDir}/MyNotes/${version}`.replace(/\\/g, '/') });
      const updatedNotes = notes.map((note) =>
        note.id === noteId ? { ...note, content } : note
      );
      setNotes(updatedNotes);
      onClose();
    } catch (error) {
      console.error('Failed to restore version:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Version History</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {versions.map((version) => (
              <Button key={version} onClick={() => setSelectedVersion(version)}>
                {version}
              </Button>
            ))}
            {selectedVersion && (
              <Button colorScheme="teal" onClick={() => handleRestoreVersion(selectedVersion)}>
                Restore Selected Version
              </Button>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VersionHistoryModal;
