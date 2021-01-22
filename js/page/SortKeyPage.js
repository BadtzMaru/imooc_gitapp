import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
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
import SortableListView from 'react-native-sortable-listview';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const TITLE_COLOR = '#678';

class SortKeyPage extends Component {
	constructor(props) {
		super(props);
		this.params = this.props.navigation.state.params;
		this.backPress = new BackPressComponent({ backPress: (e) => this.onBackPress(e) });
		this.languageDao = new LanguageDao(this.params.flag);
		this.state = {
			checkedArray: SortKeyPage._keys(this.props),
		};
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		const checkedArray = SortKeyPage._keys(nextProps, null, prevState);
		if (prevState.keys !== checkedArray) {
			return {
				keys: checkedArray,
			};
		}
		return null;
	}
	componentDidMount() {
		this.backPress.componentDidMount();
		// 如果props中标签为空则从本地存储中获取标签
		if (SortKeyPage._keys(this.props).length === 0) {
			let { onLoadLanguage } = this.props;
			onLoadLanguage(this.params.flag);
		}
	}
	componentWillUnmount() {
		this.backPress.componentWillUnmount();
	}
	static _keys(props, state) {
		// 如果state中有checkedArray则使用state中的checkedArray
		if (state && state.checkedArray && state.checkedArray.length) {
			return state.checkedArray;
		}
		// 否则从原始数据获取checkedArray
		const flag = SortKeyPage._flag(props);
		let dataArray = props.language[flag] || [];
		let keys = [];
		for (let i = 0, j = dataArray.length; i < j; i++) {
			let data = dataArray[i];
			if (data.checked) keys.push(data);
		}
		return keys;
	}
	static _flag(props) {
		const { flag } = props.navigation.state.params;
		return flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
	}
	onBackPress(e) {
		this.onBack();
		return true;
	}
	onBack() {
		if (!ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
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
	onSave(hasChecked) {
		if (!hasChecked) {
			// 如果没有排序直接返回
			if (ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
				NavigationUtil.goBack(this.props.navigation);
				return;
			}
		}
		// 保存排序后的数据
		// 获取排序后的数据
		this.languageDao.save(this.getSortResult());
		const { onLoadLanguage } = this.props;
		onLoadLanguage(this.params.flag);
		NavigationUtil.goBack(this.props.navigation);
	}
	getSortResult() {
		const flag = SortKeyPage._flag(this.props);
		let sortResultArray = ArrayUtil.clone(this.props.language[flag]);
		const originalCheckedArray = SortKeyPage._keys(this.props);
		for (let i = 0, j = originalCheckedArray.length; i < j; i++) {
			let item = originalCheckedArray[i];
			let index = this.props.language[flag].indexOf(item);
			sortResultArray.splice(index, 1, this.state.checkedArray[i]);
		}
		return sortResultArray;
	}

	render() {
		let title = this.params.flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序';
		let navigationBar = (
			<NavigationBar
				title={title}
				style={{
					backgroundColor: TITLE_COLOR,
				}}
				rightButton={ViewUtil.getRightButton('保存', () => this.onSave())}
				leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
			/>
		);
		return (
			<View style={styles.container}>
				{navigationBar}
				<SortableListView
					style={{ flex: 1 }}
					data={this.state.checkedArray}
					order={Object.keys(this.state.checkedArray)}
					onRowMoved={(e) => {
						this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
					}}
					renderRow={(row) => <SortCell data={row} {...this.params} />}
				/>
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
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SortKeyPage);

const styles = StyleSheet.create({
	container: { flex: 1 },
	line: {
		flex: 1,
		height: 0.3,
		backgroundColor: 'gray',
	},
	hidden: { height: 0 },
	item: {
		backgroundColor: '#F8F8F8',
		borderBottomWidth: 1,
		borderColor: '#eee',
		height: 50,
		justifyContent: 'center',
	},
});
const THEME_COLOR = '#678';

class SortCell extends Component {
	render() {
		return (
			<TouchableOpacity style={this.props.data.checked ? styles.item : styles.hidden} {...this.props.sortHandlers}>
				<View style={{ marginLeft: 10, flexDirection: 'row' }}>
					<MaterialCommunityIcons name='sort' size={16} style={{ marginRight: 10, color: THEME_COLOR }} />
					<Text>{this.props.data.name}</Text>
				</View>
			</TouchableOpacity>
		);
	}
}
