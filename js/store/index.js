import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducer';

// 自定义中间件
const logger = (store) => (next) => (action) => {
	if (typeof action === 'function') {
		// console.warn('dispatching a function');
	} else {
		// console.warn('dispatching', action);
	}
	const result = next(action);
	// console.warn('nextState', store.getState());
	return result;
};

const middlewares = [logger, thunk];

// 创建store
export default createStore(reducers, applyMiddleware(...middlewares));
