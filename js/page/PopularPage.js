import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
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

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const TITLE_COLOR = '#678';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

class PopularPage extends Component {
	constructor(props) {
		super(props);
		this.tabNames = ['Java', 'Android', 'IOS', 'React', 'React Native', 'PHP'];
	}
	_genTabs() {
		const tabs = {};
		this.tabNames.forEach((item, index) => {
			tabs[`tab${index}`] = {
				screen: (props) => <PopularTabPage {...this.props} tabLabel={item} />,
				navigationOptions: {
					title: item,
				},
			};
		});
		return tabs;
	}
	render() {
		let statusBar = {
			backgroundColor: TITLE_COLOR,
			barStyle: 'light-content',
		};
		let navigationBar = (
			<NavigationBar
				title='最热'
				statusBar={statusBar}
				style={{
					backgroundColor: TITLE_COLOR,
				}}
			/>
		);
		const TabNavigator = createAppContainer(
			createMaterialTopTabNavigator(this._genTabs(), {
				tabBarOptions: {
					tabStyle: styles.tabStyle,
					upperCaseLabel: false,
					scrollEnabled: true,
					style: {
						backgroundColor: '#a67',
					},
					indicatorStyle: styles.indicatorStyle,
					labelStyle: styles.labelStyle,
				},
			})
		);
		return (
			<View style={styles.container}>
				{navigationBar}
				<TabNavigator />
			</View>
		);
	}
}

const pageSize = 10; // 设为常量
class PopularTab extends Component {
	constructor(props) {
		super(props);
		const { tabLabel } = this.props;
		this.storeName = tabLabel;
	}
	componentDidMount() {
		this.loadData();
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
	loadData(loadMore) {
		const { onRefreshPopular, onLoadMorePopular } = this.props;
		const store = this._store();
		const url = this.genFetchUrl(this.storeName);
		if (loadMore) {
			onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, (calback) => {
				this.refs.toast.show('没有更多了');
			});
		} else {
			onRefreshPopular(this.storeName, url, pageSize, favoriteDao);
		}
	}
	genFetchUrl(key) {
		return URL + key + QUERY_STR;
	}
	renderItem(data) {
		const { item } = data;
		return (
			<PopularItem
				projectModel={item}
				onSelect={() => {
					NavigationUtil.goPage(
						{
							projectModel: item,
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
							titleColor={TITLE_COLOR}
							colors={[TITLE_COLOR]}
							refreshing={store.isLoading}
							onRefresh={() => {
								this.loadData();
							}}
							tintColor={TITLE_COLOR}
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
		dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, favoriteDao, callback)),
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

export default PopularPage;
