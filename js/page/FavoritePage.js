import React, { Component } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import actions from '../action/index';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createAppContainer } from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import PopularItem from '../common/PopularItem';
import TrendingItem from '../common/TrendingItem';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../common/NavigationBar';
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import EventTypes from '../util/EventTypes';
import EventBus from 'react-native-event-bus';

class FavoritePage extends Component {
	constructor(props) {
		super(props);
		this.tabNames = ['最热', '趋势'];
	}

	render() {
		const { theme } = this.props;
		let statusBar = {
			backgroundColor: theme.themeColor,
			barStyle: 'light-content',
		};
		let navigationBar = (
			<NavigationBar
				title='收藏'
				statusBar={statusBar}
				style={{
					backgroundColor: theme.themeColor,
				}}
			/>
		);
		const TabNavigator = createAppContainer(
			createMaterialTopTabNavigator(
				{
					Popular: {
						screen: (props) => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} theme={theme} />,
						navigationOptions: {
							title: '最热',
						},
					},
					Trending: {
						screen: (props) => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} theme={theme} />,
						navigationOptions: { title: '趋势' },
					},
				},
				{
					tabBarOptions: {
						tabStyle: styles.tabStyle,
						upperCaseLabel: false,
						style: {
							backgroundColor: theme.themeColor,
						},
						indicatorStyle: styles.indicatorStyle,
						labelStyle: styles.labelStyle,
					},
				}
			)
		);
		return (
			<View style={styles.container}>
				{navigationBar}
				<TabNavigator />
			</View>
		);
	}
}

const mapFavoriteStateToProps = (state) => ({
	theme: state.theme.theme,
});

export default connect(mapFavoriteStateToProps)(FavoritePage);

class FavoriteTab extends Component {
	constructor(props) {
		super(props);
		const { flag } = this.props;
		this.storeName = flag;
		this.favoriteDao = new FavoriteDao(flag);
	}
	componentDidMount() {
		this.loadData(true);
		EventBus.getInstance().addListener(
			EventTypes.bottom_tab_select,
			(this.listener = (data) => {
				if (data.to === 2) {
					this.loadData(false);
				}
			})
		);
	}
	componentWillUnmount() {
		EventBus.getInstance().removeListener();
	}
	_store() {
		const { favorite } = this.props;
		let store = favorite[this.storeName];
		if (!store) {
			store = {
				items: [],
				isLoading: false,
				peojectModes: [], // 要显示的数据
			};
		}
		return store;
	}
	loadData(isShowLoading) {
		const { onLoadFavoriteData } = this.props;
		onLoadFavoriteData(this.storeName, isShowLoading);
	}
	onFavorite(item, isFavorite) {
		FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.storeName);
		if (this.storeName === FLAG_STORAGE.flag_popular) {
			EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular);
		} else {
			EventBus.getInstance().fireEvent(EventTypes.favorite_changed_trending);
		}
	}
	renderItem(data) {
		const { theme } = this.props;
		const { item } = data;
		const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
		return (
			<Item
				theme={theme}
				projectModel={item}
				onSelect={(callback) => {
					NavigationUtil.goPage({ theme, projectModel: item, flag: this.storeName, callback }, 'DetailPage');
				}}
				onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
			/>
		);
	}
	render() {
		let store = this._store();
		const { theme } = this.props;
		return (
			<View style={styles.container}>
				<FlatList
					data={store.projectModels}
					renderItem={(data) => this.renderItem(data)}
					keyExtractor={(item) => '' + item.item.id || item.item.fullName}
					refreshControl={
						<RefreshControl
							title='Loading'
							titleColor={theme.themeColor}
							colors={[theme.themeColor]}
							refreshing={store.isLoading}
							onRefresh={() => {
								this.loadData(true);
							}}
							tintColor={theme.themeColor}
						/>
					}
				/>
				<Toast ref='toast' position='center' />
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	favorite: state.favorite,
});
const mapDispatchToProps = (dispatch) => ({
	onLoadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName, isShowLoading)),
});

const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab);

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
