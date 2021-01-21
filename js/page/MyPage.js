import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import actions from '../action';
import NavigationBar from '../common/NavigationBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MORE_MENU } from '../common/MORE_MENU';
import GlobalStyles from '../res/styles/GlobalStyles';
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../navigator/NavigationUtil';

const THEME_COLOR = '#678';

class MyPage extends Component {
	onClick(menu) {
		let RouteName = '',
			params = {};
		switch (menu) {
			case MORE_MENU.Tutorial:
				RouteName = 'WebViewPage';
				params.title = '教程';
				params.url = 'https://coding.m.imooc.com/classindex.html?cid=89';
				break;
			case MORE_MENU.About:
				RouteName = 'AboutPage';
				break;
			case MORE_MENU.About_Author:
				RouteName = 'AboutMePage';
				break;
		}
		if (RouteName) {
			NavigationUtil.goPage(params, RouteName);
		}
	}
	getItem(menu) {
		return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
	}
	render() {
		let statusBar = {
			backgroundColor: THEME_COLOR,
			barStyle: 'light-content',
		};
		let navigationBar = <NavigationBar title='我的' statusBar={statusBar} style={{ backgroundColor: THEME_COLOR }} />;
		return (
			<View style={GlobalStyles.root_container}>
				{navigationBar}
				<ScrollView>
					<TouchableOpacity onPress={() => this.onClick(MORE_MENU.About)} style={styles.item}>
						<View style={styles.about_left}>
							<Ionicons name={MORE_MENU.About.icon} size={40} style={{ marginRight: 10, color: THEME_COLOR }} />
							<Text>GitHub Popular</Text>
						</View>
						<Ionicons name='chevron-forward' size={22} style={{ marginRight: 10, color: THEME_COLOR }} />
					</TouchableOpacity>
					<View style={GlobalStyles.line} />
					{this.getItem(MORE_MENU.Tutorial)}
					<Text style={styles.groupTitle}>趋势管理</Text>
					{this.getItem(MORE_MENU.Custom_Language)}
					<View style={GlobalStyles.line} />
					{this.getItem(MORE_MENU.Sort_Language)}
					<Text style={styles.groupTitle}>最热管理</Text>
					{this.getItem(MORE_MENU.Custom_Key)}
					<View style={GlobalStyles.line} />
					{this.getItem(MORE_MENU.Sort_Key)}
					<View style={GlobalStyles.line} />
					{this.getItem(MORE_MENU.Remove_Key)}
					<Text style={styles.groupTitle}>设置</Text>
					{this.getItem(MORE_MENU.Custom_Theme)}
					<View style={GlobalStyles.line} />
					{this.getItem(MORE_MENU.About_Author)}
					<View style={GlobalStyles.line} />
					{this.getItem(MORE_MENU.Feedback)}
					<View style={GlobalStyles.line} />
					{this.getItem(MORE_MENU.CodePush)}
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	about_left: {
		alignItems: 'center',
		flexDirection: 'row',
	},
	item: {
		flexDirection: 'row',
		backgroundColor: 'white',
		padding: 10,
		height: 90,
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	groupTitle: {
		marginLeft: 10,
		marginTop: 10,
		marginBottom: 5,
		fontSize: 12,
		color: 'gray',
	},
});

const mapDispatchToProps = (dispatch) => ({
	onThemeChange: (theme) => dispatch(actions.onThemeChange(theme)),
});

export default connect(null, mapDispatchToProps)(MyPage);
