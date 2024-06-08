import React from "react";
import { HStack, Text, IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

const MotionHStack = motion(HStack);

const CustomTab = ({ title, onSelect, onClose, isActive }) => {
  return (
    <MotionHStack
      spacing={1}
      p={2}
      borderRadius="md"
      bg={isActive ? "gray.600" : "gray.700"}
      _hover={{ bg: "gray.600" }}
      cursor="pointer"
      onClick={onSelect}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
    >
      <Text>{title}</Text>
      <IconButton
        icon={<CloseIcon />}
        size="xs"
        variant="ghost"
        colorScheme="red"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering onSelect
          onClose();
        }}
      />
    </MotionHStack>
  );
};

export default CustomTab;
