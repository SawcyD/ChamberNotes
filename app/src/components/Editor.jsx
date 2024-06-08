// src/components/Editor.jsx
import React from 'react';
import { Textarea } from '@chakra-ui/react';

const Editor = ({ content, onChange }) => {
  return (
    <Textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      height="100vh"
      bg="gray.800"
      color="white"
    />
  );
};

export default Editor;
