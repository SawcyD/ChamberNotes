import React from 'react';
import { HStack, VStack, Box, Button } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomTab from './CustomTab';

const MotionBox = motion(Box);

const TabView = ({ tabs, activeTab, onSelectTab, onCloseTab }) => {
  return (
    <VStack align="stretch" spacing={0}>
      <HStack bg="gray.800" p={2} borderRadius="md" spacing={2} overflowX="auto">
        <AnimatePresence>
          {tabs.map((tab, index) => (
            <CustomTab
              key={tab.id}
              title={tab.title}
              isActive={activeTab === tab.id}
              onSelect={() => onSelectTab(tab.id)}
              onClose={() => onCloseTab(tab.id)}
            />
          ))}
        </AnimatePresence>
        <Button
          borderRadius="md"
          bg="gray.700"
          _hover={{ bg: 'gray.600' }}
          onClick={() => onSelectTab(null)} // This could open a new tab creation dialog/modal
        >
          +
        </Button>
      </HStack>
      <AnimatePresence>
        {tabs.map((tab) =>
          tab.id === activeTab ? (
            <MotionBox
              key={tab.id}
              p={4}
              bg="gray.900"
              borderRadius="md"
              flex="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
            >
              {tab.content}
            </MotionBox>
          ) : null
        )}
      </AnimatePresence>
    </VStack>
  );
};

export default TabView;
