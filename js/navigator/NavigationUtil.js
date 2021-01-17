export default class NavigationUtil {
  // 跳转到指定页面
  static goPage(params, page) {
    const navigation = NavigationUtil.navigation;
    if (!navigation) {
      return console.log('NavigationUtil.navigation can not be null');
    }
    navigation.navigate(page, {...params});
  }

  // 重置到首页
  static resetToHomePage(params) {
    const {navigation} = params;
    navigation.navigate('Main');
  }
}
