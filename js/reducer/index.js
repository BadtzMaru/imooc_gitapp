import {combineReducers} from 'redux';
import theme from './theme';
import popular from './popular';

// 合并 reducer
const index = combineReducers({theme, popular});

export default index;
