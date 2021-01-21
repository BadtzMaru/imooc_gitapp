export default class Utils {
	static checkFavorite(item, keys = []) {
		if (!keys) {
			return false;
		}
		for (let i = 0, len = keys.length; i < len; i++) {
			let id = item.fullName ? item.fullName : item.id;
			if (id.toString() === keys[i]) {
				return true;
			}
		}
		return false;
	}
}
