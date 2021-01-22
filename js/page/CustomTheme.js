import React, { Component } from 'react';
import { Modal, Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import ThemeDao from '../expand/dao/ThemeDao';
import GlobalStyles from '../res/styles/GlobalStyles';
import ThemeFactory, { ThemeFlags } from '../res/styles/ThemeFactory';
import actions from '../action';

class CustomTheme extends Component {
	constructor(props) {
		super(props);
		this.themeDao = new ThemeDao();
	}
	show() {
		this.setState({ visible: true });
	}
	dismiss() {
		this.setState({ visible: false });
	}
	onSelectTheme(themeKey) {
		this.props.onClose();
		this.themeDao.save(ThemeFlags[themeKey]);
		const { onThemeChange } = this.props;
		onThemeChange(ThemeFactory.createTheme(ThemeFlags[themeKey]));
	}
	getThemeItem(themeKey) {
		return (
			<TouchableOpacity style={{ flex: 1 }} onPress={() => this.onSelectTheme(themeKey)}>
				<View style={[{ backgroundColor: ThemeFlags[themeKey] }, styles.themeItem]}>
					<Text style={styles.themeText}>{themeKey}</Text>
				</View>
			</TouchableOpacity>
		);
	}
	renderThemeItems() {
		const views = [];
		for (let i = 0, keys = Object.keys(ThemeFlags), l = keys.length; i < l; i += 3) {
			const key1 = keys[i],
				key2 = keys[i + 1],
				key3 = keys[i + 2];
			views.push(
				<View key={i} style={{ flexDirection: 'row' }}>
					{this.getThemeItem(key1)}
					{this.getThemeItem(key2)}
					{this.getThemeItem(key3)}
				</View>
			);
		}
		return views;
	}
	renderContentView() {
		return (
			<Modal
				animationType='slide'
				transparent
				visible={this.props.visible}
				onRequestClose={() => {
					this.props.onClose();
				}}>
				<View style={styles.modalContainer}>
					<ScrollView>{this.renderThemeItems()}</ScrollView>
				</View>
			</Modal>
		);
	}
	render() {
		let view = this.props.visible ? <View style={GlobalStyles.root_container}>{this.renderContentView()}</View> : null;
		return view;
	}
}

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({
	onThemeChange: (theme) => dispatch(actions.onThemeChange(theme)),
});
export default connect(mapStateToProps, mapDispatchToProps)(CustomTheme);

const styles = StyleSheet.create({
	themeItem: {
		flex: 1,
		height: 120,
		margin: 3,
		padding: 3,
		borderRadius: 2,
		alignItems: 'center',
		justifyContent: 'center',
	},
	modalContainer: {
		flex: 1,
		margin: 10,
		backgroundColor: 'white',
		borderRadius: 3,
		shadowColor: 'gray',
		shadowOffset: { width: 2, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 2,
		padding: 3,
	},
	themeText: {
		color: 'white',
		fontWeight: '500',
		fontSize: 16,
	},
});
