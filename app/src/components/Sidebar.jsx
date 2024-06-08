import React, { useState } from 'react';
import { VStack, Box, IconButton, Collapse, useDisclosure, Text, HStack, Divider } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, AddIcon, ChevronRightIcon as ChevronIcon } from '@chakra-ui/icons';
import { FaFolderPlus } from 'react-icons/fa';
import { useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
  NOTE: 'note',
  FOLDER: 'folder',
};

const Sidebar = ({ notes, folders, onSelectNote, onAddNote, onAddFolder, onRightClick, onMoveNote }) => {
  const { isOpen: isSidebarOpen, onToggle: onSidebarToggle } = useDisclosure({ defaultIsOpen: true });
  const [openFolders, setOpenFolders] = useState({});

  const toggleFolder = (folderId) => {
    setOpenFolders((prevState) => ({
      ...prevState,
      [folderId]: !prevState[folderId],
    }));
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: [ItemTypes.NOTE, ItemTypes.FOLDER],
    drop: (item) => {
      if (item.type === ItemTypes.NOTE) {
        onMoveNote(item.id, null); // Move note to root
      } else if (item.type === ItemTypes.FOLDER) {
        // Handle folder drop logic here if needed
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <VStack
      ref={drop}
      spacing={4}
      align="stretch"
      p={4}
      bg="gray.800"
      height="100vh"
      w={isSidebarOpen ? '250px' : '50px'}
      transition="width 0.2s"
      border={isOver ? '2px dashed teal' : 'none'}
    >
      <IconButton
        icon={isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        onClick={onSidebarToggle}
        alignSelf="flex-end"
        mb={4}
      />
      <Collapse in={isSidebarOpen} animateOpacity>
        <VStack spacing={4} align="stretch">
          <HStack spacing={2}>
            <IconButton
              icon={<AddIcon />}
              onClick={onAddNote}
              aria-label="New Note"
              colorScheme="teal"
              borderRadius="md"
            />
            <IconButton
              icon={<FaFolderPlus />}
              onClick={onAddFolder}
              aria-label="New Folder"
              colorScheme="teal"
              borderRadius="md"
            />
          </HStack>
          <Divider />
          <Box mb={4}>
            <Text fontSize="lg" fontWeight="bold" color="gray.300">Chamber</Text>
          </Box>
          {folders.map((folder) => {
            const isFolderOpen = openFolders[folder.id] || false;

            const [, dropFolder] = useDrop(() => ({
              accept: [ItemTypes.NOTE],
              drop: (item) => {
                if (item.type === ItemTypes.NOTE) {
                  onMoveNote(item.id, folder.id); // Move note to folder
                }
              },
            }));

            return (
              <Box key={folder.id} ref={dropFolder}>
                <HStack onClick={() => toggleFolder(folder.id)} cursor="pointer">
                  <IconButton
                    icon={<ChevronIcon transform={isFolderOpen ? 'rotate(90deg)' : 'rotate(0deg)'} transition="transform 0.2s" />}
                    size="xs"
                    variant="ghost"
                    colorScheme="teal"
                    aria-label="Toggle Folder"
                  />
                  <Text>{folder.name}</Text>
                </HStack>
                <Collapse in={isFolderOpen} animateOpacity>
                  <Box pl={4}>
                    {notes
                      .filter((note) => note.folderId === folder.id)
                      .map((note) => (
                        <DraggableNote
                          key={note.id}
                          note={note}
                          onSelectNote={onSelectNote}
                          onRightClick={onRightClick}
                        />
                      ))}
                  </Box>
                </Collapse>
              </Box>
            );
          })}
          {notes
            .filter((note) => !note.folderId)
            .map((note) => (
              <DraggableNote
                key={note.id}
                note={note}
                onSelectNote={onSelectNote}
                onRightClick={onRightClick}
              />
            ))}
        </VStack>
      </Collapse>
    </VStack>
  );
};

const DraggableNote = ({ note, onSelectNote, onRightClick }) => {
  const [, drag] = useDrag(() => ({
    type: ItemTypes.NOTE,
    item: { id: note.id, type: ItemTypes.NOTE },
  }));

  return (
    <Box
      ref={drag}
      p={2}
      bg="gray.700"
      borderRadius="md"
      _hover={{ bg: 'gray.600' }}
      cursor="pointer"
      onClick={() => onSelectNote(note.id)}
      onContextMenu={(e) => onRightClick(e, note.id)}
    >
      {note.title}
    </Box>
  );
};

export default Sidebar;
