import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

class WelcomePage extends Component {
  componentDidMount() {
    this.timer = setTimeout(() => {
      // 跳转到首页
    }, 2000);
  }
  componentWillUnmount() {
    // 页面销毁清空计时器
    this.timer && clearTimeout(this.timer);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>WelcomePage</Text>
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
});

export default WelcomePage;
