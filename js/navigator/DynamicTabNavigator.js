import React, { Component } from 'react';
import PopularPage from '../page/PopularPage';
import TrendingPage from '../page/TrendingPage';
import FavoritePage from '../page/FavoritePage';
import MyPage from '../page/MyPage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import { connect } from 'react-redux';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';

const TABS = {
	PopularPage: {
		screen: PopularPage,
		navigationOptions: {
			tabBarLabel: '最热',
			tabBarIcon: ({ tintColor, focused }) => <MaterialIcons name='whatshot' size={26} style={{ color: tintColor }} />,
		},
	},
	TrendingPage: {
		screen: TrendingPage,
		navigationOptions: {
			tabBarLabel: '趋势',
			tabBarIcon: ({ tintColor, focused }) => <Ionicons name='md-trending-up' size={26} style={{ color: tintColor }} />,
		},
	},
	FavoritePage: {
		screen: FavoritePage,
		navigationOptions: {
			tabBarLabel: '收藏',
			tabBarIcon: ({ tintColor, focused }) => <MaterialIcons name='favorite' size={26} style={{ color: tintColor }} />,
		},
	},
	MyPage: {
		screen: MyPage,
		navigationOptions: {
			tabBarLabel: '我的',
			tabBarIcon: ({ tintColor, focused }) => <Entypo name='user' size={26} style={{ color: tintColor }} />,
		},
	},
};

class DynamicTabNavigator extends Component {
	constructor(props) {
		super(props);
	}
	_tabNavigator() {
		if (this.Tabs) {
			return this.Tabs;
		}
		const { PopularPage, TrendingPage, FavoritePage, MyPage } = TABS;
		const tabs = { PopularPage, TrendingPage, FavoritePage, MyPage };
		// PopularPage.navigationOptions.tabBarLabel = '最热1'; // 动态修改属性
		this.Tabs = createAppContainer(
			createBottomTabNavigator(tabs, {
				tabBarComponent: (props) => {
					return <TabBarComponent {...props} theme={this.props.theme} />;
				},
			})
		);
		return this.Tabs;
	}
	render() {
		const Tab = this._tabNavigator();
		return (
			<Tab
				onNavigationStateChange={(prevState, newState, action) => {
					EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, {
						from: prevState.index,
						to: newState.index,
					});
				}}
			/>
		);
	}
}

class TabBarComponent extends Component {
	render() {
		return <BottomTabBar {...this.props} activeTintColor={this.props.theme} />;
	}
}

const mapStateToProps = (state) => ({
	theme: state.theme.theme,
});

export default connect(mapStateToProps)(DynamicTabNavigator);
