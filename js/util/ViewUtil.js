import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ViewUtil {
	static getLeftBackButton(callBack) {
		return (
			<TouchableOpacity style={{ padding: 8, paddingLeft: 12 }} onPress={callBack}>
				<Ionicons name='ios-arrow-back' size={26} style={{ color: 'white' }} />
			</TouchableOpacity>
		);
	}
	static getShareButton(callBack) {
		return (
			<TouchableOpacity onPress={callBack}>
				<Ionicons name='md-share' size={20} style={{ opacity: 0.9, marginRight: 10, color: 'white' }} />
			</TouchableOpacity>
		);
	}
	static getSettingItem(callBack, text, color, Icons, icon, expandableIco) {
		return (
			<TouchableOpacity onPress={callBack} style={styles.setting_item_container}>
				<View style={{ alignItems: 'center', flexDirection: 'row' }}>
					{Icons && icon ? (
						<Icons name={icon} size={16} style={{ color: color || 'black', marginRight: 10 }} />
					) : (
						<View style={{ opacity: 1, width: 16, height: 16, marginRight: 10 }} />
					)}
					<Text>{text}</Text>
				</View>
				<Ionicons
					name={expandableIco ? expandableIco : 'chevron-forward'}
					size={22}
					style={{
						marginRight: 10,
						alignSelf: 'center',
						color: color || 'black',
					}}
				/>
			</TouchableOpacity>
		);
	}
	static getMenuItem(callBack, menu, color, expandableIco) {
		return ViewUtil.getSettingItem(callBack, menu.name, color, menu.Icons, menu.icon, expandableIco);
	}
	static getRightButton(title, callBack) {
		return (
			<TouchableOpacity style={{ alignItems: 'center' }} onPress={callBack}>
				<Text style={{ fontSize: 20, color: '#FFF', marginRight: 10 }}>{title}</Text>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	setting_item_container: {
		flexDirection: 'row',
		padding: 10,
		height: 60,
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: 'white',
	},
});
