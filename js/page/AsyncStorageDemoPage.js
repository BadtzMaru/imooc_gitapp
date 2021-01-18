import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, TextInput, AsyncStorage} from 'react-native';

const KEY = 'save_key';

export default class AsyncStorageDemoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      showText: '',
    };
  }
  doSave() {
    AsyncStorage.setItem(KEY, this.state.value).catch((error) => {
      error && console.log(error.toString());
    });
  }
  doRemove() {
    AsyncStorage.removeItem(KEY).catch((error) => {
      error && console.log(error.toString());
    });
  }
  getData() {
    AsyncStorage.getItem(KEY).then((value) => {
      this.setState({showText: value});
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>AsyncStorage 使用</Text>
        <TextInput
          style={styles.input}
          value={this.state.value}
          onChangeText={(text) => {
            this.setState({value: text});
          }}
        />
        <View style={styles.input_container}>
          <Text
            onPress={() => {
              this.doSave();
            }}>
            存储
          </Text>
          <Text
            onPress={() => {
              this.doRemove();
            }}>
            删除
          </Text>
          <Text
            onPress={() => {
              this.getData();
            }}>
            获取
          </Text>
        </View>
        <Text>{this.state.showText}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
  },
  input_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
