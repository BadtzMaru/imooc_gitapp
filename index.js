import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import AppNavigators from './js/navigator/AppNavigators';

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => AppNavigators);
