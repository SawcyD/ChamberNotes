import React, { useState, useEffect } from 'react';
import { Box, HStack, VStack, IconButton, useDisclosure, Text, extendTheme, ChakraProvider, Checkbox } from '@chakra-ui/react';
import { FaProjectDiagram, FaHistory } from 'react-icons/fa';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { invoke } from '@tauri-apps/api/tauri';
import { documentDir } from '@tauri-apps/api/path';
import { readTextFile, writeFile } from '@tauri-apps/api/fs';
import Sidebar from './components/Sidebar';
import TabView from './components/TabView';
import CombinedMarkdownEditor from './components/CombinedMarkdownEditor';
import ChatButton from './components/ChatButton';
import GraphView from './components/GraphView';
import NewNoteModal from './components/NewNoteModal';
import NewFolderModal from './components/NewFolderModal';
import ContextMenu from './components/ContextMenu';
import WelcomeModal from './components/WelcomeModal';
import SettingsPanel from './components/SettingsPanel';
import VersionHistoryModal from './components/VersionHistoryModal';

const defaultTheme = extendTheme({
  colors: {
    accent: '#319795',
  },
  styles: {
    global: {
      'html, body': {
        backgroundColor: '#1a202c',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
      },
      '.chakra-ui-dark': {
        backgroundColor: '#1a202c',
        color: 'white',
      },
    },
  },
});

const App = () => {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [links, setLinks] = useState({});
  const [backlinks, setBacklinks] = useState({});
  const [showGraph, setShowGraph] = useState(false);
  const [theme, setTheme] = useState(defaultTheme);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [recentChambers, setRecentChambers] = useState([]);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);

  const { isOpen: isNoteModalOpen, onOpen: onOpenNoteModal, onClose: onCloseNoteModal } = useDisclosure();
  const { isOpen: isFolderModalOpen, onOpen: onOpenFolderModal, onClose: onCloseFolderModal } = useDisclosure();
  const { isOpen: isWelcomeModalOpen, onOpen: onOpenWelcomeModal, onClose: onCloseWelcomeModal } = useDisclosure({ defaultIsOpen: true });
  const { isOpen: isSettingsOpen, onOpen: onOpenSettings, onClose: onCloseSettings } = useDisclosure();
  const { isOpen: isVersionHistoryOpen, onOpen: onOpenVersionHistory, onClose: onCloseVersionHistory } = useDisclosure();

  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    position: { x: 0, y: 0 },
    noteId: null,
  });

  useEffect(() => {
    const loadInitialChamber = async () => {
      try {
        const documentsDir = await documentDir();
        console.log('Documents directory:', documentsDir);
        const chamberPath = `${documentsDir}MyNotes/chamber.json`.replace(/\\/g, '/');
        await loadChamber(chamberPath);

        const recentChambersPath = `${documentsDir}MyNotes/recent_chambers.json`.replace(/\\/g, '/');
        let storedChambers = '[]';
        try {
          storedChambers = await readTextFile(recentChambersPath);
        } catch (error) {
          console.error('Failed to read recent chambers:', error);
        }
        if (storedChambers) {
          setRecentChambers(JSON.parse(storedChambers));
        }
      } catch (error) {
        console.error('Failed to load initial chamber:', error);
      }
    };

    loadInitialChamber();
  }, []);

  useEffect(() => {
    let autoSaveInterval;
    if (autoSaveEnabled) {
      autoSaveInterval = setInterval(() => {
        handleSave();
      }, 5 * 60 * 1000); // 5 minutes
    }

    return () => {
      if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
      }
    };
  }, [autoSaveEnabled, notes, folders]);

  const saveChamber = async (notes, folders, path) => {
    try {
      await invoke('save_chamber', { notes, folders, path });

      const updatedRecentChambers = [path, ...recentChambers.filter(ch => ch !== path)].slice(0, 5);
      setRecentChambers(updatedRecentChambers);
      const documentsDir = await documentDir();
      const recentChambersPath = `${documentsDir}MyNotes/recent_chambers.json`.replace(/\\/g, '/');
      await writeFile({ path: recentChambersPath, contents: JSON.stringify(updatedRecentChambers) });

      console.log('Chamber saved successfully');
    } catch (error) {
      console.error('Failed to save chamber:', error);
    }
  };

  const loadChamber = async (path) => {
    try {
      const data = await readTextFile(path);
      const [loadedNotes, loadedFolders] = JSON.parse(data);
      setNotes(loadedNotes);
      setFolders(loadedFolders);
      console.log('Chamber loaded successfully');
    } catch (error) {
      console.error('Failed to load chamber:', error);
    }
  };

  const handleSave = async () => {
    try {
      const documentsDir = await documentDir();
      const chamberPath = `${documentsDir}MyNotes/chamber.json`.replace(/\\/g, '/');
      await saveChamber(notes, folders, chamberPath);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleOpenRecent = async () => {
    try {
      const recentPath = recentChambers[0];
      if (recentPath) {
        await loadChamber(recentPath);
      }
      onCloseWelcomeModal();
    } catch (error) {
      console.error('Failed to open recent chamber:', error);
    }
  };

  const handleCreateNew = async () => {
    try {
      const documentsDir = await documentDir();
      const chamberPath = `${documentsDir}MyNotes/chamber.json`.replace(/\\/g, '/');
      await saveChamber([], [], chamberPath);
      await loadChamber(chamberPath);
      onCloseWelcomeModal();
    } catch (error) {
      console.error('Failed to create new chamber:', error);
    }
  };

  const addNote = (title, folderId) => {
    const newNote = { id: Date.now(), title, content: '', folderId };
    setNotes([...notes, newNote]);
  };

  const addFolder = (name) => {
    const newFolder = { id: Date.now(), name };
    setFolders([...folders, newFolder]);
  };

  const selectNote = (id) => {
    const note = notes.find((note) => note.id === id);
    if (note && !tabs.some((tab) => tab.id === id)) {
      setTabs([...tabs, note]);
    }
    setActiveTab(id);
    setCurrentNoteId(id);
  };

  const closeTab = (id) => {
    setTabs(tabs.filter((tab) => tab.id !== id));
    if (activeTab === id) {
      setActiveTab(tabs.length > 1 ? tabs[0].id : null);
    }
  };

  const updateNoteContent = async (id, content) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, content } : note
    );
    setNotes(updatedNotes);

    const linksInNote = getLinksFromContent(content);
    setLinks((prevLinks) => ({ ...prevLinks, [id]: linksInNote }));

    const updatedBacklinks = { ...backlinks };
    Object.keys(updatedBacklinks).forEach((key) => {
      updatedBacklinks[key] = updatedBacklinks[key].filter((link) => link !== id);
    });
    linksInNote.forEach((link) => {
      const targetNote = notes.find((note) => note.title === link);
      if (targetNote) {
        updatedBacklinks[targetNote.id] = updatedBacklinks[targetNote.id] || [];
        updatedBacklinks[targetNote.id].push(id);
      }
    });
    setBacklinks(updatedBacklinks);

    try {
      const note = updatedNotes.find((note) => note.id === id);
      const documentsDir = await documentDir();
      const notePath = `${documentsDir}MyNotes/${note.title}.md`.replace(/\\/g, '/');
      await invoke('save_versioned_file', { path: notePath, content: note.content });
    } catch (error) {
      console.error('Failed to save versioned file:', error);
    }
  };

  const getLinksFromContent = (content) => {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const matches = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.push(match[2]);
    }
    return matches;
  };

  const handleLinkClick = (link) => {
    const linkedNote = notes.find((note) => note.title === link);
    if (linkedNote) {
      selectNote(linkedNote.id);
    }
  };

  const handleRightClick = (e, noteId) => {
    e.preventDefault();
    setContextMenu({
      isVisible: true,
      position: { x: e.pageX, y: e.pageY },
      noteId,
    });
  };

  const handleDeleteNote = () => {
    setNotes(notes.filter((note) => note.id !== contextMenu.noteId));
    setContextMenu({ ...contextMenu, isVisible: false });
  };

  const handleThemeChange = (newColor) => {
    const newTheme = extendTheme({
      ...theme,
      colors: {
        ...theme.colors,
        accent: newColor,
      },
    });
    setTheme(newTheme);
  };

  const handleViewVersionHistory = (noteId) => {
    setCurrentNoteId(noteId);
    onOpenVersionHistory();
  };

  const activeNote = notes.find((note) => note.id === activeTab);

  return (
    <ChakraProvider theme={theme}>
      <DndProvider backend={HTML5Backend}>
        <HStack spacing={0} height="100vh">
          <Sidebar
            notes={notes}
            folders={folders}
            onSelectNote={selectNote}
            onAddNote={onOpenNoteModal}
            onAddFolder={onOpenFolderModal}
            onRightClick={handleRightClick}
          />
          <Box flex={1} bg="gray.900">
            {tabs.length > 0 && (
              <TabView
                tabs={tabs}
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                onCloseTab={closeTab}
              />
            )}
            {activeNote && (
              <VStack align="stretch" spacing={4} p={4} bg="gray.800" height="calc(100vh - 60px)">
                <CombinedMarkdownEditor
                  value={activeNote.content}
                  onChange={(content) => updateNoteContent(activeTab, content)}
                />
                <Box p={4} bg="gray.700" borderRadius="md">
                  <Text fontWeight="bold">Backlinks:</Text>
                  {backlinks[activeNote.id] ? backlinks[activeNote.id].map((backlinkId) => {
                    const backlinkNote = notes.find((note) => note.id === backlinkId);
                    return (
                      <Text key={backlinkId} onClick={() => selectNote(backlinkId)} cursor="pointer">
                        {backlinkNote.title}
                      </Text>
                    );
                  }) : <Text>No backlinks</Text>}
                </Box>
              </VStack>
            )}
            <ChatButton />
            <IconButton
              icon={<FaProjectDiagram />}
              aria-label="Graph View"
              position="fixed"
              bottom="20px"
              left="20px"
              isRound
              size="lg"
              colorScheme="teal"
              onClick={() => setShowGraph(!showGraph)}
            />
            <IconButton
              icon={<FaHistory />}
              aria-label="View Version History"
              position="fixed"
              bottom="20px"
              right="20px"
              isRound
              size="lg"
              colorScheme="teal"
              onClick={() => handleViewVersionHistory(currentNoteId)}
            />
            {showGraph && (
              <GraphView notes={notes} links={links} />
            )}
          </Box>
          <NewNoteModal isOpen={isNoteModalOpen} onClose={onCloseNoteModal} onSave={addNote} />
          <NewFolderModal isOpen={isFolderModalOpen} onClose={onCloseFolderModal} onSave={addFolder} />
          <ContextMenu
            isVisible={contextMenu.isVisible}
            position={contextMenu.position}
            onClose={() => setContextMenu({ ...contextMenu, isVisible: false })}
            onDelete={handleDeleteNote}
          />
          <SettingsPanel isOpen={isSettingsOpen} onClose={onCloseSettings} onThemeChange={handleThemeChange}>
            <Checkbox
              isChecked={autoSaveEnabled}
              onChange={(e) => setAutoSaveEnabled(e.target.checked)}
            >
              Enable Auto-Save
            </Checkbox>
          </SettingsPanel>
        </HStack>
        <WelcomeModal
          isOpen={isWelcomeModalOpen}
          onClose={onCloseWelcomeModal}
          onOpenRecent={handleOpenRecent}
          onCreateNew={handleCreateNew}
        />
        <VersionHistoryModal isOpen={isVersionHistoryOpen} onClose={onCloseVersionHistory} noteId={currentNoteId} />
      </DndProvider>
    </ChakraProvider>
  );
};

export default App;
