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
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';

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
			case MORE_MENU.Sort_Key:
				RouteName = 'SortKeyPage';
				params.flag = FLAG_LANGUAGE.flag_key;
				break;
			case MORE_MENU.Sort_Language:
				RouteName = 'SortKeyPage';
				params.flag = FLAG_LANGUAGE.flag_language;
				break;
			case MORE_MENU.About_Author:
				RouteName = 'AboutMePage';
				break;
			case MORE_MENU.Custom_Theme:
				const { onShowCustomThemeView } = this.props;
				console.log(onShowCustomThemeView);
				onShowCustomThemeView(true);
				break;
			case MORE_MENU.Custom_Key:
			case MORE_MENU.Custom_Language:
			case MORE_MENU.Remove_Key:
				RouteName = 'CustomKeyPage';
				params.isRemoveKey = menu === MORE_MENU.Remove_Key;
				params.flag = menu !== MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language;
				break;
		}
		if (RouteName) {
			NavigationUtil.goPage(params, RouteName);
		}
	}
	getItem(menu) {
		const { theme } = this.props;
		return ViewUtil.getMenuItem(() => this.onClick(menu), menu, theme.themeColor);
	}
	render() {
		const { theme } = this.props;
		let statusBar = {
			backgroundColor: theme.themeColor,
			barStyle: 'light-content',
		};
		let navigationBar = <NavigationBar title='我的' statusBar={statusBar} style={{ backgroundColor: theme.styles.navBar.backgroundColor }} />;
		return (
			<View style={GlobalStyles.root_container}>
				{navigationBar}
				<ScrollView>
					<TouchableOpacity onPress={() => this.onClick(MORE_MENU.About)} style={styles.item}>
						<View style={styles.about_left}>
							<Ionicons name={MORE_MENU.About.icon} size={40} style={{ marginRight: 10, color: theme.themeColor }} />
							<Text>GitHub Popular</Text>
						</View>
						<Ionicons name='chevron-forward' size={22} style={{ marginRight: 10, color: theme.themeColor }} />
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

const mapStateToProps = (state) => ({
	theme: state.theme.theme,
});
const mapDispatchToProps = (dispatch) => ({
	onShowCustomThemeView: (show) => dispatch(actions.onShowCustomThemeView(show)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);
