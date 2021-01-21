import AsyncStorage from '@react-native-community/async-storage';

const FAVORITE_KEY_PREFIX = 'favorite_';
export default class FavoriteDao {
	constructor(flag) {
		this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
	}
	saveFavoriteItem(key, value, callback) {
		AsyncStorage.setItem(key, value, (error) => {
			if (!error) {
				this.updateFavoriteKeys(key, true);
			}
		});
	}
	updateFavoriteKeys(key, isAdd) {
		AsyncStorage.getItem(this.favoriteKey, (error, result) => {
			if (!error) {
				let favoriteKeys = [];
				if (result) {
					favoriteKeys = JSON.parse(result);
				}
				let index = favoriteKeys.indexOf(key);
				if (isAdd) {
					// 如果是添加且key不在存在则添加到数组中
					if (index === -1) {
						favoriteKeys.push(key);
					}
				} else {
					// 如果是删除且key存在则将其从数值中移除
					if (index !== -1) {
						favoriteKeys.splice(index, 1);
					}
				}
				AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys));
			}
		});
	}
	getFavoriteKeys() {
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem(this.favoriteKey, (error, result) => {
				if (!error) {
					try {
						resolve(JSON.parse(result));
					} catch (e) {
						reject(error);
					}
				} else {
					reject(error);
				}
			});
		});
	}
	removeFavoriteItem(key) {
		AsyncStorage.removeItem(key, (error) => {
			if (!error) {
				this.updateFavoriteKeys(key, false);
			}
		});
	}
	getAllItems() {
		return new Promise((resolve, reject) => {
			this.getFavoriteKeys()
				.then((keys) => {
					let items = [];
					if (keys) {
						AsyncStorage.multiGet(keys, (err, stores) => {
							if (err) {
								return;
							}
							try {
								stores.map((result, i, store) => {
									// get at each store's key/value so you can work with it
									let value = store[i][1];
									if (value) {
										items.push(JSON.parse(value));
									}
								});
								resolve(items);
							} catch (e) {
								reject(e);
							}
						});
					} else {
						resolve(items);
					}
				})
				.catch((e) => {
					reject(e);
				});
		});
	}
}
