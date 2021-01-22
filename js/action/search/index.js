import Types from '../types';
import DataStore, { FLAG_STORAGE } from '../../expand/dao/DataStore';
import { handleData, _projectModels, doCallBack } from '../ActionUtil';
import ArrayUtil from '../../util/ArrayUtil';

const API_URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const CANCEL_TOKENS = [];

export function onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callBack) {
	return (dispatch) => {
		dispatch({
			type: Types.SEARCH_REFRESH,
		});
		fetch(genFetchUrl(inputKey))
			.then((response) => {
				return hasCancel(token, true) ? null : response.json();
			})
			.then((responseData) => {
				if (hasCancel(token, true)) {
					console.warn('user cancel');
					return;
				}
				if (!responseData || !responseData.items || responseData.items.length === 0) {
					dispatch({ type: Types.SEARCH_FAIL, message: `没找到关于${inputKey}的项目` });
					doCallBack(callBack, `没找到关于${inputKey}的项目`);
					return;
				}
				let items = responseData.items;
				handleData(Types.SEARCH_REFRESH_SUCCESS, dispatch, '', { data: items }, pageSize, favoriteDao, {
					showBottomButton: !checkKeyIsExist(popularKeys, inputKey),
					inputKey,
				});
			})
			.catch((e) => {
				console.warn(e);
				dispatch({ type: Types.SEARCH_FAIL, error: e.toString() });
			});
	};
}

function genFetchUrl(key) {
	return API_URL + key + QUERY_STR;
}

function hasCancel(token, isRemove) {
	if (CANCEL_TOKENS.includes(token)) {
		isRemove && ArrayUtil.remove(CANCEL_TOKENS, token);
		return true;
	}
	return false;
}

function checkKeyIsExist(keys, key) {
	for (let i = 0, l = keys.length; i < l; i++) {
		if (key.toLowerCase() === keys[i].name.toLowerCase()) return true;
	}
	return false;
}

export function onSearchCancel(token) {
	return (dispatch) => {
		CANCEL_TOKENS.push(token);
		dispatch({ type: Types.SEARCH_CANCEL });
	};
}

export function onLoadMoreSearch(pageIndex, pageSize, dataArray = [], favoriteDao, callBack) {
	return (dispatch) => {
		setTimeout(() => {
			if ((pageIndex - 1) * pageSize >= dataArray.length) {
				if (typeof callBack === 'function') {
					callBack('no more');
				}
				dispatch({
					type: Types.POPULAR_LOAD_MORE_FAIL,
					error: 'no more',
					pageIndex: --pageIndex,
				});
			} else {
				let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
				_projectModels(dataArray.slice(0, max), favoriteDao, (data) => {
					dispatch({
						type: Types.POPULAR_LOAD_MORE_SUCCESS,
						pageIndex,
						projectModels: data,
					});
				});
			}
		}, 500);
	};
}
