import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import WelcomePage from './js/page/WelcomePage';

AppRegistry.registerComponent(appName, () => WelcomePage);
