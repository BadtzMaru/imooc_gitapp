import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

class DetailPage extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>详情页</Text>
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

export default DetailPage;
