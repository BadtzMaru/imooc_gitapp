import { onThemeChange, onThemeInit, onShowCustomThemeView } from './theme';
import { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } from './popular';
import { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } from './trending';
import { onLoadFavoriteData } from './favorite';
import { onLoadLanguage } from './language';
import { onSearch, onLoadMoreSearch, onSearchCancel } from './search';

export default {
	onThemeChange,
	onThemeInit,
	onRefreshPopular,
	onLoadMorePopular,
	onRefreshTrending,
	onLoadMoreTrending,
	onLoadFavoriteData,
	onFlushPopularFavorite,
	onFlushTrendingFavorite,
	onLoadLanguage,
	onShowCustomThemeView,
	onSearch,
	onLoadMoreSearch,
	onSearchCancel,
};
