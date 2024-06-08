import React, { useState } from 'react';
import { Box, Textarea, VStack, HStack, IconButton } from '@chakra-ui/react';
import { FaBold, FaItalic, FaHeading, FaQuoteLeft, FaListUl, FaListOl } from 'react-icons/fa';

const MarkdownEditor = ({ value, onChange, onLinkClick }) => {
  const [editorValue, setEditorValue] = useState(value);

  const handleEditorChange = (e) => {
    const newValue = e.target.value;
    setEditorValue(newValue);
    onChange(newValue);
  };

  const insertText = (text) => {
    const textarea = document.getElementById('markdown-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = editorValue.substring(0, start);
    const after = editorValue.substring(end);
    const newValue = before + text + after;
    setEditorValue(newValue);
    onChange(newValue);
    textarea.focus();
    textarea.selectionStart = start + text.length;
    textarea.selectionEnd = start + text.length;
  };

  const handleLinkClick = (link) => {
    if (onLinkClick) {
      onLinkClick(link);
    }
  };

  return (
    <VStack align="stretch" spacing={2}>
      <HStack spacing={1}>
        <IconButton
          icon={<FaBold />}
          aria-label="Bold"
          onClick={() => insertText('**bold**')}
        />
        <IconButton
          icon={<FaItalic />}
          aria-label="Italic"
          onClick={() => insertText('_italic_')}
        />
        <IconButton
          icon={<FaHeading />}
          aria-label="Heading"
          onClick={() => insertText('# Heading')}
        />
        <IconButton
          icon={<FaQuoteLeft />}
          aria-label="Quote"
          onClick={() => insertText('> quote')}
        />
        <IconButton
          icon={<FaListUl />}
          aria-label="Unordered List"
          onClick={() => insertText('- item')}
        />
        <IconButton
          icon={<FaListOl />}
          aria-label="Ordered List"
          onClick={() => insertText('1. item')}
        />
      </HStack>
      <Textarea
        id="markdown-editor"
        value={editorValue}
        onChange={handleEditorChange}
        placeholder="Write your markdown here..."
        size="sm"
        height="400px"
        bg="gray.800"
        color="white"
      />
    </VStack>
  );
};

export default MarkdownEditor;
