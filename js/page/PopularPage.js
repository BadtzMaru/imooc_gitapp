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
import PopularItem from '../common/PopularItem';
import Toast from 'react-native-easy-toast';

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const TITLE_COLOR = 'red';

class PopularPage extends Component {
  constructor(props) {
    super(props);
    this.tabNames = ['Java', 'Android', 'IOS', 'React', 'React Native', 'PHP'];
  }
  _genTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        screen: (props) => <PopularTabPage {...this.props} tabLabel={item} />,
        navigationOptions: {
          title: item,
        },
      };
    });
    return tabs;
  }
  render() {
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
        <TabNavigator />
      </View>
    );
  }
}

const pageSize = 10; // 设为常量
class PopularTab extends Component {
  constructor(props) {
    super(props);
    const {tabLabel} = this.props;
    this.storeName = tabLabel;
  }
  componentDidMount() {
    this.loadData();
  }
  _store() {
    const {popular} = this.props;
    let store = popular[this.storeName];
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
    const {onRefreshPopular, onLoadMorePopular} = this.props;
    const store = this._store();
    const url = this.genFetchUrl(this.storeName);
    if (loadMore) {
      onLoadMorePopular(
        this.storeName,
        ++store.pageIndex,
        pageSize,
        store.items,
        (calback) => {
          this.refs.toast.show('没有更多了');
        },
      );
    } else {
      onRefreshPopular(this.storeName, url, pageSize);
    }
  }
  genFetchUrl(key) {
    return URL + key + QUERY_STR;
  }
  renderItem(data) {
    const {item} = data;
    return <PopularItem item={item} onSelect={() => {}} />;
  }
  genIndicator() {
    return this._store().hideLoadingMore ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} color="cyan" />
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
          keyExtractor={(item) => '' + item.id}
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
  popular: state.popular,
});

const mapDispatchToProps = (dispatch) => ({
  onRefreshPopular: (storeName, url, pageSize) =>
    dispatch(actions.onRefreshPopular(storeName, url, pageSize)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, callback) =>
    dispatch(
      actions.onLoadMorePopular(
        storeName,
        pageIndex,
        pageSize,
        items,
        callback,
      ),
    ),
});

const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);

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

export default PopularPage;
