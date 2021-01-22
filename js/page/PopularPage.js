import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import actions from '../action/index';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import PopularItem from '../common/PopularItem';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../common/NavigationBar';
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const TITLE_COLOR = '#678';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

class PopularPage extends Component {
	constructor(props) {
		super(props);
		const { onLoadLanguage } = this.props;
		onLoadLanguage(FLAG_LANGUAGE.flag_key);
	}
	_genTabs() {
		const tabs = {};
		const { keys, theme } = this.props;
		keys.forEach((item, index) => {
			if (item.checked) {
				tabs[`tab${index}`] = {
					screen: (props) => <PopularTabPage {...this.props} tabLabel={item.name} theme={theme} />,
					navigationOptions: {
						title: item.name,
					},
				};
			}
		});
		return tabs;
	}
	render() {
		const { keys, theme } = this.props;
		let statusBar = {
			backgroundColor: TITLE_COLOR,
			barStyle: 'light-content',
		};
		let navigationBar = (
			<NavigationBar
				title='最热'
				statusBar={statusBar}
				style={{
					backgroundColor: theme.themeColor,
				}}
			/>
		);
		const TabNavigator = keys.length
			? createAppContainer(
					createMaterialTopTabNavigator(this._genTabs(), {
						tabBarOptions: {
							tabStyle: styles.tabStyle,
							upperCaseLabel: false,
							scrollEnabled: true,
							style: {
								backgroundColor: theme.styles.navBar.backgroundColor,
							},
							indicatorStyle: styles.indicatorStyle,
							labelStyle: styles.labelStyle,
						},
						lazy: true,
					})
			  )
			: null;
		return (
			<View style={styles.container}>
				{navigationBar}
				{TabNavigator && <TabNavigator />}
			</View>
		);
	}
}
const mapPopularStateToProps = (state) => ({
	keys: state.language.keys,
	theme: state.theme.theme,
});
const mapPopularDispatchToProps = (dispatch) => ({
	onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(PopularPage);

const pageSize = 10; // 设为常量

class PopularTab extends Component {
	constructor(props) {
		super(props);
		const { tabLabel } = this.props;
		this.storeName = tabLabel;
		this.isFavoriteChanged = false;
	}
	componentDidMount() {
		this.loadData();
		EventBus.getInstance().addListener(
			EventTypes.favorite_changed_popular,
			(this.favoriteChangeListener = () => {
				this.isFavoriteChanged = true;
			})
		);
		EventBus.getInstance().addListener(
			EventTypes.bottom_tab_select,
			(this.bottomTabSelectListener = (data) => {
				if (data.to === 0 && this.isFavoriteChanged) {
					this.loadData(null, true);
				}
			})
		);
	}
	componentWillUnmount() {
		EventBus.getInstance().removeListener(this.favoriteChangeListener);
		EventBus.getInstance().removeListener(this.bottomTabSelectListener);
	}
	_store() {
		const { popular } = this.props;
		let store = popular[this.storeName];
		if (!store) {
			store = {
				items: [],
				isLoading: false,
				peojectModes: [], // 要显示的数据
				hideLoadingMore: true, // 默认隐藏加载更多
			};
		}
		return store;
	}
	loadData(loadMore, refreshFavorite) {
		const { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } = this.props;
		const store = this._store();
		const url = this.genFetchUrl(this.storeName);
		if (loadMore) {
			onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, (calback) => {
				this.refs.toast.show('没有更多了');
			});
		} else if (refreshFavorite) {
			onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
		} else {
			onRefreshPopular(this.storeName, url, pageSize, favoriteDao);
		}
	}
	genFetchUrl(key) {
		return URL + key + QUERY_STR;
	}
	renderItem(data) {
		const { item } = data;
		const { theme } = this.props;
		return (
			<PopularItem
				theme={theme}
				projectModel={item}
				onSelect={(callback) => {
					NavigationUtil.goPage(
						{
							theme,
							projectModel: item,
							flag: FLAG_STORAGE.flag_popular,
							callback,
						},
						'DetailPage'
					);
				}}
				onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
			/>
		);
	}
	genIndicator() {
		return this._store().hideLoadingMore ? null : (
			<View style={styles.indicatorContainer}>
				<ActivityIndicator style={styles.indicator} color='#000' />
				<Text>正在加载更多...</Text>
			</View>
		);
	}
	render() {
		const { theme } = this.props;
		let store = this._store();
		return (
			<View style={styles.container}>
				<FlatList
					data={store.projectModels}
					renderItem={(data) => this.renderItem(data)}
					keyExtractor={(item) => '' + item.item.id}
					refreshControl={
						<RefreshControl
							title='Loading'
							titleColor={theme.themeColor}
							colors={[theme.themeColor]}
							refreshing={store.isLoading}
							onRefresh={() => {
								this.loadData();
							}}
							tintColor={theme.themeColor}
						/>
					}
					ListFooterComponent={() => this.genIndicator()}
					onEndReached={() => {
						setTimeout(() => {
							if (this.canLoadMore) {
								this.loadData(true);
								this.canLoadMore = false;
							}
						}, 100);
					}}
					onEndReachedThreshold={0.5}
					onMomentumScrollBegin={() => {
						this.canLoadMore = true;
					}}
				/>
				<Toast ref='toast' position='center' />
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	popular: state.popular,
});

const mapDispatchToProps = (dispatch) => ({
	onRefreshPopular: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshPopular(storeName, url, pageSize, favoriteDao)),
	onLoadMorePopular: (storeName, pageIndex, pageSize, items, favoriteDao, callback) =>
		dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao)),
	onFlushPopularFavorite: (storeName, pageIndex, pageSize, items, favoriteDao, callback) =>
		dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
});

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	tabStyle: {},
	indicatorStyle: {
		height: 2,
		backgroundColor: 'white',
	},
	labelStyle: {
		fontSize: 13,
	},
	indicatorContainer: {
		alignItems: 'center',
	},
	indicator: {
		color: 'red',
		margin: 10,
	},
});
