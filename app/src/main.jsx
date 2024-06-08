import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { createRoot } from 'react-dom/client';
import App from './App';
import theme from './theme';

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
);