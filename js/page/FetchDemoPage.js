import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, TextInput} from 'react-native';

export default class FetchDemoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKey: '',
      showText: '',
    };
  }
  loadData() {
    let url = `https://api.github.com/search/repositories?q=${this.searchKey}`;
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => {
        this.setState({
          showText: responseText,
        });
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Ftech 使用</Text>
        <View style={styles.input_container}>
          <TextInput
            style={styles.input}
            value={this.state.searchKey}
            onChangeText={(text) => {
              this.setState({searchKey: text});
            }}
          />
          <Button
            title="获取"
            onPress={() => {
              this.loadData();
            }}
          />
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
    flex: 1,
    borderWidth: 1,
    marginRight: 10,
  },
  input_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
