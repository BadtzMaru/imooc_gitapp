import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import actions from '../action';
import NavigationBar from '../common/NavigationBar';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const THEME_COLOR = '#678';

class MyPage extends Component {
	getRightButton() {
		return (
			<View style={{ flexDirection: 'row' }}>
				<TouchableOpacity>
					<View style={{ padding: 5, marginRight: 8 }}>
						<Feather name='search' size={24} style={{ color: 'white' }} />
					</View>
				</TouchableOpacity>
			</View>
		);
	}
	getLeftButton() {
		return (
			<TouchableOpacity style={{ padding: 8, paddingLeft: 12 }}>
				<Ionicons name='ios-arrow-back' size={26} style={{ color: 'white' }} />
			</TouchableOpacity>
		);
	}
	render() {
		let statusBar = {
			backgroundColor: THEME_COLOR,
			barStyle: 'light-content',
		};
		let navigationBar = (
			<NavigationBar
				title='我的'
				statusBar={statusBar}
				style={{ backgroundColor: THEME_COLOR }}
				rightButton={this.getRightButton()}
				leftButton={this.getLeftButton()}
			/>
		);
		return <View style={styles.container}>{navigationBar}</View>;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F3FCFF',
	},
});

const mapDispatchToProps = (dispatch) => ({
	onThemeChange: (theme) => dispatch(actions.onThemeChange(theme)),
});

export default connect(null, mapDispatchToProps)(MyPage);
