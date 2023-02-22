import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DashboardScreen from '../../screens/DashboardScreen';
import Svg, {Path} from 'react-native-svg';
import SettingScreen from '../../screens/SetingScreen';
import ZakazScreen from '../../screens/DestinationScreen';
import MessagesScreen from '../../screens/MessagesScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const Home = (
    <Svg
      width={30}
      height={30}
      fill="#80884D"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-testid="CabinIcon"
      tabIndex="-1"
      title="Cabin">
      <Path d="M10 1c0 1.66-1.34 3-3 3-.55 0-1 .45-1 1H4c0-1.66 1.34-3 3-3 .55 0 1-.45 1-1h2zm2 2L6 7.58V6H4v3.11L1 11.4l1.21 1.59L4 11.62V21h16v-9.38l1.79 1.36L23 11.4 12 3zm1.94 4h-3.89L12 5.52 13.94 7zm-6.5 2h9.12L18 10.1v.9H6v-.9L7.44 9zM18 13v2H6v-2h12zM6 19v-2h12v2H6z" />
    </Svg>
  );
  const Bike = (
    <Svg
      width={30}
      height={30}
      fill="#80884D"
      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-zjt8k"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-testid="MopedIcon"
      tabIndex="-1"
      title="Moped">
      <Path d="M19 7c0-1.1-.9-2-2-2h-3v2h3v2.65L13.52 14H10V9H6c-2.21 0-4 1.79-4 4v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4.48L19 10.35V7zM7 17c-.55 0-1-.45-1-1h2c0 .55-.45 1-1 1z" />
      <Path d="M5 6h5v2H5zm14 7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </Svg>
  );
  const Cart = (
    <Svg
      width={30}
      height={30}
      fill="#80884D"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-testid="ForumIcon"
      tabIndex="-1"
      title="Forum">
      <Path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
    </Svg>
  );
  const Settings = (
    <Svg
      width={30}
      height={30}
      fill="#80884D"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-testid="SettingsIcon"
      tabIndex="-1"
      title="Settings">
      <Path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </Svg>
  );
  return (
    <>
      <Tab.Navigator initialRouteName="Dashboard">
        <Tab.Screen
          component={DashboardScreen}
          name="Dashboard"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: () => Home,
          }}
        />
        <Tab.Screen
          component={ZakazScreen}
          name="DestinationScreen"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: () => Bike,
          }}
        />
        <Tab.Screen
          component={MessagesScreen}
          name="Messages"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: () => Cart,
          }}
        />
        <Tab.Screen
          component={SettingScreen}
          name="Settings"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: () => Settings,
          }}
        />
      </Tab.Navigator>
    </>
  );
}
export default TabNavigator;
