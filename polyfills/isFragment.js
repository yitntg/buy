import React from 'react';

export default function isFragment(node) {
  return React.isValidElement(node) && node.type === React.Fragment;
} 