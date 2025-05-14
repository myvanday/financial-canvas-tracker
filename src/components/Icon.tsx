
import React from 'react';
import * as Icons from 'lucide-react-native';

interface IconProps {
  name: keyof typeof Icons;
  size?: number;
  color?: string;
  style?: any; // Allow style prop to be passed
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000', style }) => {
  // Convert kebab-case names to PascalCase if needed
  const formattedName = name.split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') as keyof typeof Icons;
  
  const LucideIcon = Icons[formattedName] as React.ComponentType<any>;
  
  if (!LucideIcon) {
    console.error(`Icon with name ${formattedName} not found`);
    return null;
  }
  
  return <LucideIcon size={size} color={color} style={style} />;
};

export default Icon;
