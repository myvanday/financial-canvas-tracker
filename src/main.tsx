
import { AppRegistry } from 'react-native';
import App from './App';

// Register the app
AppRegistry.registerComponent('NetWorthTracker', () => App);

// For web compatibility
if (typeof document !== 'undefined') {
  AppRegistry.runApplication('NetWorthTracker', {
    rootTag: document.getElementById('root')
  });
}
