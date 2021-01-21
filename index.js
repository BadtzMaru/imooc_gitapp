import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import App from './js/App';

console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => App);
