import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, TextInput} from 'react-native';
import DataStore from '../expand/dao/DataStore';
import AsyncStorage from '@react-native-community/async-storage';

const KEY = 'save_key';

export default class DataStoreDemoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'java',
      showText: '',
    };
    this.dataStore = new DataStore();
  }
  loadData() {
    let url = `https://api.github.com/search/repositories?q=${this.state.value}`;
    console.log(url);
    this.dataStore
      .fetchData(url)
      .then((data) => {
        console.log(data);
        this.setState({showText: JSON.stringify(data)});
      })
      .catch((error) => {
        error && console.log(error.toString());
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>离线缓存框架设计</Text>
        <TextInput
          style={styles.input}
          value={this.state.value}
          onChangeText={(text) => {
            this.setState({value: text});
          }}
        />
        <Text
          onPress={() => {
            this.loadData();
          }}>
          获取
        </Text>
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
