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
import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
import BackPressComponent from '../common/BackPressComponent';
import action from '../action/index';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const TITLE_COLOR = '#678';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

class CustomKeyPage extends Component {
	constructor(props) {
		super(props);
		this.params = this.props.navigation.state.params;
		this.backPress = new BackPressComponent({ backPress: (e) => this.onBackPress(e) });
		this.changeValues = [];
		this.isRemoveKey = !!this.params.isRemoveKey;
		this.languageDao = new LanguageDao(this.params.flag);
		this.state = {
			keys: [],
		};
		this.setState({ keys: CustomKeyPage._keys(this.props) });
	}
	componentDidMount() {
		this.backPress.componentDidMount();
		// 如果props中标签为空则从本地存储中获取标签
		if (CustomKeyPage._keys(this.props).length === 0) {
			let { onLoadLanguage } = this.props;
			onLoadLanguage(this.params.flag);
		}
	}
	componentWillUnmount() {
		this.backPress.componentWillUnmount();
	}
	static _keys(props, original, state) {
		const { flag, isRemoveKey } = props.navigation.state.params;
		let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
		if (isRemoveKey && original) {
		} else {
			return props.language[key];
		}
	}
	onBackPress(e) {
		this.onBack();
		return true;
	}
	onBack() {}

	render() {
		let title = this.isRemoveKey ? '移出标签' : '自定义标签';
		title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
		let navigationBar = (
			<NavigationBar
				title={title}
				style={{
					backgroundColor: TITLE_COLOR,
				}}
			/>
		);
	}
}
const mapPopularStateToProps = (state) => ({
	language: state.language,
});
const mapPopularDispatchToProps = (dispatch) => ({
	onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag)),
});
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(CustomKeyPage);
