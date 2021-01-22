import AsyncStorage from '@react-native-community/async-storage';
import ThemeFactory, { ThemeFlags } from '../../res/styles/ThemeFactory';

const THEME_KEY = 'theme_key';

export const FLAG_LANGUAGE = { flag_language: 'language_dao_language', flag_key: 'language_dao_key' };
export default class ThemeDao {
	getTheme() {
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem(THEME_KEY, (error, result) => {
				if (error) {
					reject(error);
					return;
				}
				if (!result) {
					this.save(ThemeFlags.Default);
					result = ThemeFlags.Default;
				}
				resolve(ThemeFactory.createTheme(result));
			});
		});
	}
	save(themeFlags) {
		AsyncStorage.setItem(THEME_KEY, themeFlags, (error) => {});
	}
}
