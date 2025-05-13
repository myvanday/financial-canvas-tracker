
import React from 'react';
import { Home, PieChart, History, Plus, ArrowLeft, Edit, ChevronRight, X, User, Settings } from 'lucide-react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000' }) => {
  switch (name) {
    case 'home':
      return <Home size={size} color={color} />;
    case 'pie-chart':
      return <PieChart size={size} color={color} />;
    case 'history':
      return <History size={size} color={color} />;
    case 'plus':
      return <Plus size={size} color={color} />;
    case 'arrow-left':
      return <ArrowLeft size={size} color={color} />;
    case 'edit':
      return <Edit size={size} color={color} />;
    case 'chevron-right':
      return <ChevronRight size={size} color={color} />;
    case 'close':
      return <X size={size} color={color} />;
    case 'user':
      return <User size={size} color={color} />;
    case 'settings':
      return <Settings size={size} color={color} />;
    default:
      return null;
  }
};

export default Icon;
