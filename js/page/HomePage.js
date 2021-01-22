import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import actions from '../action';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator';
import NavigationUtil from '../navigator/NavigationUtil';
import CustomTheme from '../page/CustomTheme';

class HomePage extends Component {
	constructor(props) {
		super(props);
	}
	renderCustomThemeView() {
		const { customThemeViewVisible, onShowCustomThemeView } = this.props;
		return <CustomTheme visible={customThemeViewVisible} {...this.props} onClose={() => onShowCustomThemeView(false)} />;
	}
	render() {
		// FIX DynamicTabNavigator中的页面无法跳转到外层导航器页面的问题
		NavigationUtil.navigation = this.props.navigation;
		return (
			<View style={{ flex: 1 }}>
				<DynamicTabNavigator />
				{this.renderCustomThemeView()}
			</View>
		);
	}
}
const mapStateToProps = (state) => ({
	nav: state.nav,
	customThemeViewVisible: state.theme.customThemeViewVisible,
});
const mapDispatchToProps = (dispatch) => ({
	onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
