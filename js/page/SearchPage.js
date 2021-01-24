import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity, TextInput, Platform } from 'react-native';
import { connect } from 'react-redux';
import actions from '../action/index';
import NavigationUtil from '../navigator/NavigationUtil';
import PopularItem from '../common/PopularItem';
import Toast from 'react-native-easy-toast';
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
import BackPressComponent from '../common/BackPressComponent';
import GlobalStyles from '../res/styles/GlobalStyles';
import ViewUtil from '../util/ViewUtil';
import Utils from '../util/Utils';

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

const pageSize = 10; // 设为常量

class SearchPage extends Component {
	constructor(props) {
		super(props);
		this.params = this.props.navigation.state.params;
		this.backPress = new BackPressComponent({ backPress: (e) => this.onBackPress(e) });
		this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
		this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
		this.isKeyChange = false;
	}
	componentDidMount() {
		this.backPress.componentDidMount();
	}
	componentWillUnmount() {
		this.backPress.componentWillUnmount();
	}
	onBackPress() {
		const { onSearchCancel, onLoadLanguage } = this.props;
		onSearchCancel();
		this.refs.input.blur();
		NavigationUtil.goBack(this.props.navigation);
		if (this.isKeyChange) {
			onLoadLanguage(FLAG_LANGUAGE.flag_key);
		}
		return true;
	}
	loadData(loadMore) {
		const { onLoadMoreSearch, onSearch, search, keys } = this.props;
		if (loadMore) {
			onLoadMoreSearch(++search.pageIndex, pageSize, search.items, this.favoriteDao, (calback) => {
				this.toast.show('没有更多了');
			});
		} else {
			onSearch(this.inputKey, pageSize, (this.searchToken = new Date().getTime()), this.favoriteDao, keys, (message) => {
				this.toast.show(message);
			});
		}
	}
	renderItem(data) {
		const { item } = data;
		const { theme } = this.params;
		return (
			<PopularItem
				projectModel={item}
				theme={theme}
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
		const { search } = this.props;
		return search.hideLoadingMore ? null : (
			<View style={styles.indicatorContainer}>
				<ActivityIndicator style={styles.indicator} color='#000' />
				<Text>正在加载更多...</Text>
			</View>
		);
	}
	saveKey() {
		const { keys } = this.props;
		let key = this.inputKey;
		if (Utils.checkKeyIsExist(keys, key)) {
			this.toast.show(key + '已经存在');
		} else {
			key = { path: key, name: key, checked: true };
			keys.unshift(key);
			this.languageDao.save(keys);
			this.toast.show(key.name + '保存成功');
			this.isKeyChange = true;
		}
	}
	onRightButtonClick() {
		const { onSearchCancel, search } = this.props;
		if (search.showText === '搜索') {
			this.loadData();
		} else {
			onSearchCancel(this.searchToken);
		}
	}
	renderNavBar() {
		const { theme } = this.params;
		const { showText, inputKey } = this.props.search;
		const placeholder = inputKey || '请输入';
		let backButton = ViewUtil.getLeftBackButton(() => this.onBackPress());
		let inputView = <TextInput ref='input' placeholder={placeholder} onChangeText={(text) => (this.inputKey = text)} style={styles.textInput} />;
		let rightButton = (
			<TouchableOpacity
				onPress={() => {
					this.refs.input.blur();
					this.onRightButtonClick();
				}}>
				<View style={{ marginRight: 10 }}>
					<Text style={styles.title}>{showText}</Text>
				</View>
			</TouchableOpacity>
		);
		return (
			<View
				style={{
					backgroundColor: theme.themeColor,
					flexDirection: 'row',
					alignItems: 'center',
					height: Platform.OS === 'ios' ? GlobalStyles.nav_bar_height_ios : GlobalStyles.nav_bar_height_android,
				}}>
				{backButton}
				{inputView}
				{rightButton}
			</View>
		);
	}
	render() {
		const { theme } = this.params;
		const { isLoading, projectModels, showBottomButton } = this.props.search;
		let listView = !isLoading ? (
			<FlatList
				data={projectModels}
				renderItem={(data) => this.renderItem(data)}
				keyExtractor={(item) => '' + item.item.id}
				contentInset={{ bottom: 45 }}
				refreshControl={
					<RefreshControl
						title='Loading'
						titleColor={theme.themeColor}
						colors={[theme.themeColor]}
						refreshing={isLoading}
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
		) : null;
		let bottomButton = showBottomButton ? (
			<TouchableOpacity
				style={[styles.bottomButton, { backgroundColor: theme.themeColor }]}
				onPress={() => {
					this.saveKey();
				}}>
				<View style={{ justifyContent: 'center' }}>
					<Text style={styles.title}>朕收下了</Text>
				</View>
			</TouchableOpacity>
		) : null;
		let indicatorView = isLoading ? <ActivityIndicator style={styles.centering} color='#ccc' size='large' animating={isLoading} /> : null;
		let resultView = (
			<View style={{ flex: 1 }}>
				{indicatorView}
				{listView}
			</View>
		);
		return (
			<View style={styles.container}>
				{this.renderNavBar()}
				{resultView}
				{bottomButton}
				<Toast ref={(toast) => (this.toast = toast)} position='center' />
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	search: state.search,
	keys: state.language.keys,
});

const mapDispatchToProps = (dispatch) => ({
	onSearch: (inputKey, pageSize, token, favoriteDao, popularKeys, callBack) =>
		dispatch(actions.onSearch(inputKey, pageSize, token, favoriteDao, popularKeys, callBack)),
	onSearchCancel: (token) => dispatch(actions.onSearchCancel(token)),
	onLoadMoreSearch: (pageIndex, pageSize, dataArray, favoriteDao, callBack) =>
		dispatch(actions.onLoadMoreSearch(pageIndex, pageSize, dataArray, favoriteDao, callBack)),
	onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);

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
	bottomButton: {
		alignItems: 'center',
		justifyContent: 'center',
		opacity: 0.9,
		height: 40,
		position: 'absolute',
		left: 10,
		top: GlobalStyles.window_height - 65,
		right: 10,
		borderRadius: 3,
	},
	centering: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},
	textInput: {
		flex: 1,
		height: Platform.OS === 'ios' ? 26 : 36,
		borderWidth: Platform.OS === 'ios' ? 1 : 0,
		borderColor: 'white',
		alignSelf: 'center',
		paddingLeft: 5,
		marginRight: 10,
		marginLeft: 5,
		borderRadius: 3,
		opacity: 0.7,
		color: 'white',
	},
	title: {
		fontSize: 18,
		color: 'white',
		fontWeight: '500',
	},
});
