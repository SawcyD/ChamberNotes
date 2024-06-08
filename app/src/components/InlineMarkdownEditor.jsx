// src/components/InlineMarkdownEditor.jsx
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import remarkGfm from 'remark-gfm';
import { Box } from '@chakra-ui/react';

const InlineMarkdownEditor = ({ value, onChange }) => {
  const [editorValue, setEditorValue] = useState(value);

  const handleEditorChange = ({ text }) => {
    setEditorValue(text);
    onChange(text);
  };

  return (
    <Box>
      <MdEditor
        value={editorValue}
        style={{ height: '100vh', backgroundColor: 'inherit', color: 'inherit' }}
        renderHTML={(text) => <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>}
        onChange={handleEditorChange}
        config={{
          view: {
            menu: true,
            md: true,
            html: false,
          },
        }}
      />
    </Box>
  );
};

export default InlineMarkdownEditor;
