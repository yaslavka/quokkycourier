import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import TabNavigator from '../TabNavigation';
import PaymentsScreen from '../../screens/PaymentsScreen';
import SettingScreen from '../../screens/SetingScreen';
import HelpScreen from '../../screens/HelpScreen';
import DrawerContent from '../DrawerContent';
import MessagesScreen from '../../screens/MessagesScreen';
import CartScreen from '../../screens/CartScreen';
import StatusScreen from '../../screens/RequestScreen';
const Drawer = createDrawerNavigator();

function Navbar() {
  return (
    <Drawer.Navigator
      initialRouteName="TabNavigator"
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Cart"
        component={CartScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Payments"
        component={PaymentsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Help"
        component={HelpScreen}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Status"
        component={StatusScreen}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}
export default Navbar;
