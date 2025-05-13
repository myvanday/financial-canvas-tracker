
import React from 'react';
import * as Icons from 'lucide-react-native';

interface IconProps {
  name: keyof typeof Icons;
  size?: number;
  color?: string;
  style?: any; // Allow style prop to be passed
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000', style }) => {
  const LucideIcon = Icons[name] as React.ComponentType<any>;
  
  if (!LucideIcon) {
    console.error(`Icon with name ${name} not found`);
    return null;
  }
  
  return <LucideIcon size={size} color={color} style={style} />;
};

export default Icon;
