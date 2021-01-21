import React, { Component } from 'react';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import NavigationUtil from '../navigator/NavigationUtil';

class HomePage extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		// FIX DynamicTabNavigator中的页面无法跳转到外层导航器页面的问题
		NavigationUtil.navigation = this.props.navigation;
		return <DynamicTabNavigator />;
	}
}

export default HomePage;
