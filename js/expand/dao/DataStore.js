import AsyncStorage from '@react-native-community/async-storage';
import {call} from 'react-native-reanimated';
import Trending from 'GitHubTrending';

export const FLAG_STORAGE = {
  flag_popular: 'popular',
  flag_trending: 'trending',
};

const AUTH_TOKEN = '0d5d00fdd11b90c9f26337437b7f7280e3cdb2f7';

export default class DataStore {
  saveData(url, data, callback) {
    if (!data || !url) return;
    AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
  }
  _wrapData(data) {
    return {
      data,
      timestamp: new Date().getTime(),
    };
  }
  fetchLocalData(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(e);
          }
        } else {
          reject(error);
        }
      });
    });
  }
  fetchNetData(url, flag) {
    return new Promise((resolve, reject) => {
      if (flag !== FLAG_STORAGE.flag_trending) {
        fetch(url)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Network response was not ok.');
            }
          })
          .then((responseData) => {
            this.saveData(url, responseData);
            resolve(responseData);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        new Trending(AUTH_TOKEN)
          .fetchTrending(url)
          .then((items) => {
            if (!items) {
              throw new Error('responseData is null');
            }
            this.saveData(url, items);
            resolve(items);
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  }
  fetchData(url, flag) {
    return new Promise((resolve, reject) => {
      this.fetchLocalData(url)
        .then((wrapData) => {
          if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
            resolve(wrapData);
          } else {
            this.fetchNetData(url, flag)
              .then((data) => {
                resolve(this._wrapData(data));
              })
              .catch((error) => {
                reject(error);
              });
          }
        })
        .catch((error) => {
          this.fetchNetData(url, flag)
            .then((data) => {
              resolve(this._wrapData(data));
            })
            .catch((error) => {
              reject(error);
            });
        });
    });
  }
  static checkTimestampValid(timestamp) {
    const currentDate = new Date();
    const targetDate = new Date();
    targetDate.setTime(timestamp);
    if (currentDate.getMonth() !== targetDate.getMonth()) return false;
    if (currentDate.getDate() !== targetDate.getDate()) return false;
    if (currentDate.getHours() - targetDate.getHours() > 4) return false;
    return true;
  }
}
