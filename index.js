/**
 * @format
 */

import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {Provider} from 'react-redux';
import isBetween from 'dayjs/plugin/isBetween';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import './src/localization/i18n';
import configureStore from './src/config/store';
import {PersistGate} from 'redux-persist/integration/react';
dayjs.extend(isBetween);
dayjs.extend(timezone);
dayjs.extend(utc);
export const store = configureStore();
import {name as appName} from './app.json';
const ReduxProvider = () => {
  return (
    <Provider store={store.store}>
      <PersistGate loading={null} persistor={store.persistor}>
        <SafeAreaProvider>
          <App />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => ReduxProvider);
