import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createAppContainer} from 'react-navigation';
import NavigationUtil from '../navigator/NavigationUtil';
import TrendingItem from '../common/TrendingItem';
import Toast from 'react-native-easy-toast';
import NavigationBar from '../common/NavigationBar';

const URL = 'https://github.com/trending/';
const TITLE_COLOR = '#678';

class TrendingPage extends Component {
  constructor(props) {
    super(props);
    this.tabNames = ['All', 'C', 'C#', 'PHP', 'JavaScript'];
  }
  _genTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: (props) => <TrendingTabPage {...this.props} tabLabel={item} />,
        navigationOptions: {
          title: item,
        },
      };
    });
    return tabs;
  }
  render() {
    let statusBar = {
      backgroundColor: TITLE_COLOR,
      barStyle: 'light-content',
    };
    let navigationBar = (
      <NavigationBar
        title="趋势"
        statusBar={statusBar}
        style={{
          backgroundColor: TITLE_COLOR,
        }}
      />
    );
    const TabNavigator = createAppContainer(
      createMaterialTopTabNavigator(this._genTabs(), {
        tabBarOptions: {
          tabStyle: styles.tabStyle,
          upperCaseLabel: false,
          scrollEnabled: true,
          style: {
            backgroundColor: '#a67',
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle,
        },
      }),
    );
    return (
      <View style={styles.container}>
        {navigationBar}
        <TabNavigator />
      </View>
    );
  }
}

const pageSize = 10; // 设为常量
class TrendingTab extends Component {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
  }
  componentDidMount() {
    this.loadData();
  }
  _store() {
    const {trending} = this.props;
    let store = trending[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        peojectModes: [], // 要显示的数据
        hideLoadingMore: true, // 默认隐藏加载更多
      };
    }
    return store;
  }
  loadData(loadMore) {
    const {onRefreshTrending, onLoadMoreTrending} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMoreTrending(
        this.storeName,
        ++store.pageIndex,
        pageSize,
        store.items,
        (calback) => {
          this.refs.toast.show('没有更多了');
        },
      );
    } else {
      onRefreshTrending(this.storeName, url, pageSize);
    }
  }
  genFetchUrl(key) {
    return URL + key + '?since=daily';
  }
  renderItem(data) {
    const {item} = data;
    return <TrendingItem item={item} onSelect={() => {}} />;
  }
  genIndicator() {
    return this._store().hideLoadingMore ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} color="#000" />
        <Text>正在加载更多...</Text>
      </View>
    );
  }
  render() {
    let store = this._store();
    return (
      <View style={styles.container}>
        <FlatList
          data={store.projectModes}
          renderItem={(data) => this.renderItem(data)}
          keyExtractor={(item) => '' + (item.id || item.fullName)}
          refreshControl={
            <RefreshControl
              title="Loading"
              titleColor={TITLE_COLOR}
              colors={[TITLE_COLOR]}
              refreshing={store.isLoading}
              onRefresh={() => {
                this.loadData();
              }}
              tintColor={TITLE_COLOR}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            setTimeout(() => {
              if (this.canLoadMore) {
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}
          onMomentumScrollBegin={() => {
            this.canLoadMore = true;
          }}
        />
        <Toast ref="toast" position="center" />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  trending: state.trending,
});

const mapDispatchToProps = (dispatch) => ({
  onRefreshTrending: (storeName, url, pageSize) =>
    dispatch(actions.onRefreshTrending(storeName, url, pageSize)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, callback) =>
    dispatch(
      actions.onLoadMoreTrending(
        storeName,
        pageIndex,
        pageSize,
        items,
        callback,
      ),
    ),
});

const TrendingTabPage = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrendingTab);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  tabStyle: {
    minWidth: 50,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: 'white',
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6,
  },
  indicatorContainer: {
    alignItems: 'center',
  },
  indicator: {
    color: 'red',
    margin: 10,
  },
});

export default TrendingPage;
