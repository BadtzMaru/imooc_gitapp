import React, {Component} from 'react';
import {Provider} from 'react-redux';
import AppNavigators from './navigator/AppNavigators';
import store from './store';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigators />
      </Provider>
    );
  }
}
