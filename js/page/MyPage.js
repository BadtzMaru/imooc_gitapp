import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

class MyPage extends Component {
  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>MyPage</Text>
        <Button
          title="修改主题"
          onPress={() =>
            navigation.setParams({
              theme: {
                tintColor: 'red',
                updateTime: new Date().getTime(),
              },
            })
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default MyPage;
