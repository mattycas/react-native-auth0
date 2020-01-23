import {NativeModules, Linking, Platform} from 'react-native';

export default class Agent {
  show(url, closeOnLoad = false, useAuthSession = true) {
    if (!NativeModules.A0Auth0) {
      return Promise.reject(
        new Error(
          'Missing NativeModule. React Native versions 0.60 and up perform auto-linking. Please see https://github.com/react-native-community/cli/blob/master/docs/autolinking.md.',
        ),
      );
    }

    return new Promise((resolve, reject) => {
      const urlHandler = event => {
        NativeModules.A0Auth0.hide();
        Linking.removeEventListener('url', urlHandler);
        resolve(event.url);
      };
      Linking.addEventListener('url', urlHandler);
      const showCallback = (error, redirectURL) => {
        Linking.removeEventListener('url', urlHandler);
        if (error) {
          reject(error);
        } else if (redirectURL) {
          resolve(redirectURL);
        } else if (closeOnLoad) {
          resolve();
        }
      };
      Platform.OS === 'ios'
        ? NativeModules.A0Auth0.showUrl(
            url,
            closeOnLoad,
            useAuthSession,
            showCallback,
          )
        : NativeModules.A0Auth0.showUrl(url, closeOnLoad, showCallback);
    });
  }

  newTransaction() {
    if (!NativeModules.A0Auth0) {
      return Promise.reject(
        new Error(
          'Missing NativeModule. React Native versions 0.60 and up perform auto-linking. Please see https://github.com/react-native-community/cli/blob/master/docs/autolinking.md.',
        ),
      );
    }

    return new Promise((resolve, reject) => {
      NativeModules.A0Auth0.oauthParameters(parameters => {
        resolve(parameters);
      });
    });
  }
}
