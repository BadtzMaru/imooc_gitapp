import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil';

class WelcomePage extends Component {
  componentDidMount() {
    this.timer = setTimeout(() => {
      // 跳转到首页
      NavigationUtil.resetToHomePage(this.props);
    }, 2000);
  }
  componentWillUnmount() {
    // 页面销毁清空计时器
    this.timer && clearTimeout(this.timer);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>WelcomePage</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default WelcomePage;
