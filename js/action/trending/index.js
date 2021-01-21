import Types from '../types';
import DataStore, { FLAG_STORAGE } from '../../expand/dao/DataStore';
import { handleData, _projectModels } from '../ActionUtil';

// 获取最热数据action
export function onRefreshTrending(storeName, url, pageSize, favoriteDao) {
	return (dispatch) => {
		dispatch({
			type: Types.TRENDING_REFRESH,
			storeName,
		});
		let dataStore = new DataStore();
		dataStore
			.fetchData(url, FLAG_STORAGE.flag_trending)
			.then((data) => {
				handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao);
			})
			.catch((error) => {
				dispatch({
					type: Types.LOAD_POPULAR_FAIL,
					storeName,
					error,
				});
			});
	};
}

export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callback) {
	return (dispatch) => {
		setTimeout(() => {
			if ((pageIndex - 1) * pageSize >= dataArray.length) {
				if (typeof callback === 'function') {
					callback('no more');
				}
				dispatch({
					type: Types.TRENDING_LOAD_MORE_FAIL,
					error: 'no more',
					storeName,
					pageIndex: --pageIndex,
				});
			} else {
				let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
				_projectModels(dataArray.slice(0, max), favoriteDao, (data) => {
					dispatch({
						type: Types.TRENDING_LOAD_MORE_SUCCESS,
						storeName,
						pageIndex,
						projectModels: data,
					});
				});
			}
		}, 500);
	};
}
