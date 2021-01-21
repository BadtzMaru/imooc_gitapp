import { combineReducers } from 'redux';
import theme from './theme';
import popular from './popular';
import trending from './trending';
import favorite from './favorite';

// 合并 reducer
const index = combineReducers({ theme, popular, trending, favorite });

export default index;
