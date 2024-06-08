import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Box } from '@chakra-ui/react';

const MarkdownPreview = ({ content, onLinkClick }) => {
  const renderers = {
    link: ({ href, children }) => (
      <a href="#" onClick={() => onLinkClick(href)}>
        {children}
      </a>
    ),
  };

  return (
    <Box
      p={4}
      bg="gray.900"
      color="white"
      borderRadius="md"
      overflowY="auto"
      height="400px"
      className="markdown-preview"
    >
      <ReactMarkdown components={renderers} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownPreview;
