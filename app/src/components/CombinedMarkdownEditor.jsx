// src/components/CombinedMarkdownEditor.jsx
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import remarkGfm from 'remark-gfm';
import { Box, VStack } from '@chakra-ui/react';

const CombinedMarkdownEditor = ({ value, onChange }) => {
  const [editorValue, setEditorValue] = useState(value);

  const handleEditorChange = ({ text }) => {
    setEditorValue(text);
    onChange(text);
  };

  return (
    <VStack align="stretch" spacing={2} height="100vh">
      <MdEditor
        value={editorValue}
        style={{ height: '50vh' }}
        renderHTML={(text) => <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>}
        onChange={handleEditorChange}
        config={{
          view: {
            menu: true,
            md: true,
            html: true,
            fullScreen: false,
            hideMenu: false,
          },
          shortcuts: true,
          syncScrollMode: ['leftFollowRight', 'rightFollowLeft'],
          hideIcons: ['image', 'link'],
        }}
      />
    </VStack>
  );
};

export default CombinedMarkdownEditor;
