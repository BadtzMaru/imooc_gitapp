import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import actions from '../action/index';
import NavigationUtil from '../navigator/NavigationUtil';
import NavigationBar from '../common/NavigationBar';
import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
import BackPressComponent from '../common/BackPressComponent';
import ViewUtil from '../util/ViewUtil';
import CheckBox from '../components/react-native-check-box';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ArrayUtil from '../util/ArrayUtil';

const TITLE_COLOR = '#678';

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
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
			return {
				keys: CustomKeyPage._keys(nextProps, null, prevState),
			};
		}
		return null;
	}
	componentDidMount() {
		this.backPress.componentDidMount();
		// 如果props中标签为空则从本地存储中获取标签
		if (CustomKeyPage._keys(this.props).length === 0) {
			let { onLoadLanguage } = this.props;
			onLoadLanguage(this.params.flag);
		}
		this.setState({ keys: CustomKeyPage._keys(this.props) });
	}
	componentWillUnmount() {
		this.backPress.componentWillUnmount();
	}
	static _keys(props, original, state) {
		const { flag, isRemoveKey } = props.navigation.state.params;
		let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
		if (isRemoveKey && !original) {
			return (
				(state && state.keys && state.keys.length !== 0 && state.keys) ||
				props.language[key].map((val) => {
					return {
						...val,
						checked: false,
					};
				})
			);
		} else {
			return props.language[key];
		}
	}
	onBackPress(e) {
		this.onBack();
		return true;
	}
	onBack() {
		if (this.changeValues.length > 0) {
			Alert.alert('提示', '要保存修改吗?', [
				{
					text: '否',
					onPress: () => {
						NavigationUtil.goBack(this.props.navigation);
					},
				},
				{
					text: '是',
					onPress: () => {
						this.onSave();
					},
				},
			]);
		} else {
			NavigationUtil.goBack(this.props.navigation);
		}
	}
	onSave() {
		if (this.changeValues.length === 0) {
			return NavigationUtil.goBack(this.props.navigation);
		}
		let keys;
		if (this.isRemoveKey) {
			for (let i = 0, l = this.changeValues.length; i < l; i++) {
				ArrayUtil.remove((keys = CustomKeyPage._keys(this.props, true)), this.changeValues[i], 'name');
			}
		}
		this.languageDao.save(keys || this.state.keys);
		const { onLoadLanguage } = this.props;
		onLoadLanguage(this.params.flag);
		NavigationUtil.goBack(this.props.navigation);
	}
	renderView() {
		let dataArray = this.state.keys;
		if (!dataArray || dataArray.length === 0) return null;
		let len = dataArray.length;
		let views = [];
		for (let i = 0, l = len; i < l; i += 2) {
			views.push(
				<View key={i}>
					<View style={styles.item}>
						{this.renderCheckoBox(dataArray[i], i)}
						{i + 1 < len ? this.renderCheckoBox(dataArray[i + 1], i + 1) : <View style={{ flex: 1 }} />}
					</View>
					<View style={styles.line} />
				</View>
			);
		}
		return views;
	}
	onClick(data, index) {
		data.checked = !data.checked;
		ArrayUtil.updateArray(this.changeValues, data);
		this.state.keys[index] = data;
		this.setState({
			keys: this.state.keys,
		});
	}
	_checkedImage(checked) {
		return <Ionicons name={checked ? 'ios-checkbox' : 'md-square-outline'} size={20} style={{ color: TITLE_COLOR }} />;
	}
	renderCheckoBox(data, index) {
		return (
			<CheckBox
				style={{ flex: 1, padding: 10 }}
				onClick={() => this.onClick(data, index)}
				isChecked={data.checked}
				leftText={data.name}
				checkedImage={this._checkedImage(true)}
				unCheckedImage={this._checkedImage(false)}
			/>
		);
	}
	render() {
		let title = this.isRemoveKey ? '移出标签' : '自定义标签';
		title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
		let rightButtonTitle = this.isRemoveKey ? '移除' : '保存';
		let navigationBar = (
			<NavigationBar
				title={title}
				style={{
					backgroundColor: TITLE_COLOR,
				}}
				rightButton={ViewUtil.getRightButton(rightButtonTitle, () => this.onSave())}
				leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
			/>
		);
		return (
			<View style={styles.container}>
				{navigationBar}
				<ScrollView>{this.renderView()}</ScrollView>
			</View>
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

const styles = StyleSheet.create({
	container: { flex: 1 },
	item: {
		flexDirection: 'row',
	},
	line: {
		flex: 1,
		height: 0.3,
		backgroundColor: 'gray',
	},
});
