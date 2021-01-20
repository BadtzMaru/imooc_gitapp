import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import actions from '../action/index';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import TrendingItem from '../common/TrendingItem';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../common/NavigationBar';
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

const URL = 'https://github.com/trending/';
const TITLE_COLOR = '#678';
// 事件名常量
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE';

class TrendingPage extends Component {
	constructor(props) {
		super(props);
		this.tabNames = ['All', 'C', 'C#', 'PHP', 'JavaScript'];
		this.state = {
			timeSpan: TimeSpans[0],
		};
	}
	_genTabs() {
		const tabs = {};
		this.tabNames.forEach((item, index) => {
			tabs[`tab${index}`] = {
				screen: (props) => <TrendingTabPage {...this.props} tabLabel={item} timeSpan={this.state.timeSpan} />,
				navigationOptions: {
					title: item,
				},
			};
		});
		return tabs;
	}
	renderTitleView() {
		return (
			<View>
				<TouchableOpacity ref='button' onPress={() => this.dialog.show()}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Text style={{ fontSize: 18, color: '#FFF', fontWeight: '400' }}>趋势 {this.state.timeSpan.showText}</Text>
						<MaterialIcons name='arrow-drop-down' style={22} style={{ color: 'white' }} />
					</View>
				</TouchableOpacity>
			</View>
		);
	}
	onSelectTimeSpan(tab) {
		this.dialog.dismiss();
		this.setState({ timeSpan: tab });
		DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
	}
	renderTrendingDialog() {
		return <TrendingDialog ref={(dialog) => (this.dialog = dialog)} onSelect={(tab) => this.onSelectTimeSpan(tab)} />;
	}
	_tabNav() {
		if (!this.tabNav) {
			this.tabNav = createAppContainer(
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
		}
		return this.tabNav;
	}
	render() {
		let statusBar = {
			backgroundColor: TITLE_COLOR,
			barStyle: 'light-content',
		};
		let navigationBar = (
			<NavigationBar
				titleView={this.renderTitleView()}
				statusBar={statusBar}
				style={{
					backgroundColor: TITLE_COLOR,
				}}
			/>
		);
		const TabNavigator = this._tabNav();
		return (
			<View style={styles.container}>
				{navigationBar}
				<TabNavigator />
				{this.renderTrendingDialog()}
			</View>
		);
	}
}

const pageSize = 10; // 设为常量
class TrendingTab extends Component {
	constructor(props) {
		super(props);
		const { tabLabel, timeSpan } = this.props;
		this.storeName = tabLabel;
		this.timeSpan = timeSpan;
	}
	componentDidMount() {
		this.loadData();
		this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
			this.timeSpan = this.timeSpan;
			this.loadData();
		});
	}
	componentWillUnmount() {
		if (this.timeSpanChangeListener) this.timeSpanChangeListener.remove();
	}
	_store() {
		const { trending } = this.props;
		let store = trending[this.storeName];
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
		const { onRefreshTrending, onLoadMoreTrending } = this.props;
		const store = this._store();
		const url = this.genFetchUrl(this.storeName);
		if (loadMore) {
			onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, (calback) => {
				this.refs.toast.show('没有更多了');
			});
		} else {
			onRefreshTrending(this.storeName, url, pageSize, favoriteDao);
		}
	}
	genFetchUrl(key) {
		return URL + key + '?' + this.timeSpan.searchText;
	}
	renderItem(data) {
		const { item } = data;
		return (
			<TrendingItem
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
					keyExtractor={(item) => '' + (item.item.id || item.item.fullName)}
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
	trending: state.trending,
});

const mapDispatchToProps = (dispatch) => ({
	onRefreshTrending: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
	onLoadMoreTrending: (storeName, pageIndex, pageSize, items, favoriteDao, callback) =>
		dispatch(actions.onLoadMoreTrending(storeName, pageIndex, pageSize, items, favoriteDao, callback)),
});

const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab);

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	tabStyle: {
		minWidth: 50,
	},
	indicatorStyle: {
		height: 2,
		backgroundColor: 'white',
	},
	labelStyle: {
		fontSize: 13,
		marginTop: 6,
		marginBottom: 6,
	},
	indicatorContainer: {
		alignItems: 'center',
	},
	indicator: {
		color: 'red',
		margin: 10,
	},
});

export default TrendingPage;
