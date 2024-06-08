import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const styles = {
  global: (props) => ({
    body: {
      bg: mode('gray.900', 'gray.900')(props),
      color: mode('white', 'white')(props),
      margin: 0,
      padding: 0,
      fontFamily: 'Inter, sans-serif',
    },
    '.rc-md-editor': {
      bg: 'inherit',
      color: 'inherit',
    },
    '.rc-md-editor .rc-md-navigation': {
      bg: 'gray.800',
      color: 'inherit',
    },
    '.rc-md-editor .rc-md-html': {
      bg: 'inherit',
      color: 'inherit',
    },
  }),
};

const theme = extendTheme({ config, styles });

export default theme;
