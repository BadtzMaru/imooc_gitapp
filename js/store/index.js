import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducer';

const middlewares = [thunk];

// 创建store
export default createStore(reducers, applyMiddleware(...middlewares));
