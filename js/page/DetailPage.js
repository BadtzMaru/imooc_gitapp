import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { WebView } from 'react-native-webview';
import NavigationUtil from '../navigator/NavigationUtil';
import BackPressComponent from '../common/BackPressComponent';
import FavoriteDao from '../expand/dao/FavoriteDao';

const TRENDING_URL = 'https://github.com/';
const THEME_COLOR = '#678';

class DetailPage extends Component {
	constructor(props) {
		super(props);
		this.params = this.props.navigation.state.params;
		let { projectModel, flag } = this.params;
		projectModel = projectModel.item;
		this.favoriteDao = new FavoriteDao(flag);
		this.url = projectModel.html_url || TRENDING_URL + projectModel.fullName;
		const title = projectModel.full_name || projectModel.fullName;
		this.state = {
			title,
			url: this.url,
			canGoBack: false,
			isFavorite: this.params.projectModel.isFavorite,
		};
		this.backPress = new BackPressComponent({ backPress: () => this.onBackPress() });
	}
	componentDidMount() {
		this.backPress.componentDidMount();
	}
	componentWillUnmount() {
		this.backPress.componentWillUnmount();
	}
	onBackPress() {
		this.onBack();
		return true;
	}
	onBack() {
		if (this.state.canGoBack) {
			this.webView.goBack();
		} else {
			NavigationUtil.goBack(this.props.navigation);
		}
	}
	onFavoriteButtonClick() {
		let { projectModel, callback } = this.params;
		const isFavorite = (projectModel.isFavorite = !projectModel.isFavorite);
		callback(isFavorite);
		this.setState({ isFavorite });
		let key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString();
		if (projectModel.isFavorite) {
			this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel));
		} else {
			this.favoriteDao.removeFavoriteItem(key);
		}
	}
	renderRightButton() {
		return (
			<View style={{ flexDirection: 'row' }}>
				<TouchableOpacity onPress={() => this.onFavoriteButtonClick()}>
					<FontAwesome name={this.state.isFavorite ? 'star' : 'star-o'} size={20} style={{ color: 'white', marginRight: 10 }} />
				</TouchableOpacity>
				{ViewUtil.getShareButton(() => {})}
			</View>
		);
	}
	onNavigationStateChange(navState) {
		this.setState({ canGoBack: navState.canGoBack, url: navState.url });
	}
	render() {
		const titleLayoutStyle = this.state.title.length > 20 ? { paddingRight: 30 } : null;
		let navigationBar = (
			<NavigationBar
				title={this.state.title}
				titleLayoutStyle={titleLayoutStyle}
				leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
				rightButton={this.renderRightButton()}
				style={{ backgroundColor: THEME_COLOR }}
			/>
		);
		return (
			<View style={styles.container}>
				{navigationBar}
				<WebView
					ref={(webView) => (this.webView = webView)}
					startInLoadingState
					onNavigationStateChange={(e) => this.onNavigationStateChange(e)}
					source={{ uri: this.state.url }}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default DetailPage;
