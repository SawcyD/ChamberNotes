// src/components/GraphView.jsx
import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { Box } from '@chakra-ui/react';

const GraphView = ({ notes, links }) => {
  const nodes = notes.map(note => ({ id: note.id, name: note.title }));
  const edges = [];

  Object.entries(links).forEach(([noteId, linkedNotes]) => {
    linkedNotes.forEach(linkedNote => {
      const linkedNoteObj = notes.find(note => note.title === linkedNote);
      if (linkedNoteObj) {
        edges.push({ source: noteId, target: linkedNoteObj.id });
      }
    });
  });

  return (
    <Box p={4} bg="gray.800" borderRadius="md" overflowY="auto" height="400px">
      <ForceGraph2D
        graphData={{ nodes, links: edges }}
        nodeLabel="name"
        width={600}
        height={400}
      />
    </Box>
  );
};

export default GraphView;
