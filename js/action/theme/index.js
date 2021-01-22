import ThemeDao from '../../expand/dao/ThemeDao';
import Types from '../types';

export function onThemeChange(theme) {
	return {
		type: Types.THEME_CHANGE,
		theme,
	};
}

export function onThemeInit() {
	return (dispatch) => {
		new ThemeDao().getTheme().then((data) => {
			dispatch(onThemeChange(data));
		});
	};
}

export function onShowCustomThemeView(show) {
	return { type: Types.SHOW_THEME_VIEW, customThemeViewVisible: show };
}
