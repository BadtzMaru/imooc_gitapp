import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import NavigationBar from '../common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
import { WebView } from 'react-native-webview';
import NavigationUtil from '../navigator/NavigationUtil';
import BackPressComponent from '../common/BackPressComponent';

const THEME_COLOR = '#678';

class WebViewPage extends Component {
	constructor(props) {
		super(props);
		this.params = this.props.navigation.state.params;
		const { title, url } = this.params;
		this.state = {
			title,
			url,
			canGoBack: false,
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
	onNavigationStateChange(navState) {
		this.setState({ canGoBack: navState.canGoBack, url: navState.url });
	}
	render() {
		let navigationBar = (
			<NavigationBar
				title={this.state.title}
				style={{ backgroundColor: THEME_COLOR }}
				leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
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

export default WebViewPage;
