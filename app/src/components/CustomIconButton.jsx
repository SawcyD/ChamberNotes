// src/components/CustomIconButton.jsx
import React from 'react';
import { IconButton, Tooltip, useStyleConfig, useToken } from '@chakra-ui/react';

const CustomIconButton = ({ icon, ariaLabel, onClick, tooltipLabel }) => {
  const styles = useStyleConfig('Button', { variant: 'ghost' });
  const accentColor = useToken('colors', 'teal.400'); // Using Chakra UI color token

  return (
    <Tooltip label={tooltipLabel} aria-label={ariaLabel}>
      <IconButton
        icon={icon}
        aria-label={ariaLabel}
        onClick={onClick}
        sx={{
          ...styles,
          _hover: {
            bg: accentColor,
            color: 'white',
          },
          _active: {
            bg: accentColor,
            color: 'white',
          },
        }}
      />
    </Tooltip>
  );
};

export default CustomIconButton;
