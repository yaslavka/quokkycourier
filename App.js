import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from './src/actions/app.actions';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignInScreen from './src/screens/SigInScreen';
import Navbar from './src/Components/Navbar';
import SignUpScreen from './src/screens/SignUpScreen';
import MapScreen from './src/screens/MapScreen';
import ZakazScreen from './src/screens/DestinationScreen';
import GlavnyScreen from './src/screens/GlavnyScreen';
import Glavny3Screen from './src/screens/GlavnyScreen/glavn3';
import Glavny2Screen from './src/screens/GlavnyScreen/glavnyy2';
import ResetPasswordScreen from './src/screens/ForgotScreen';
import PaymentsScreen from './src/screens/PaymentsScreen';
import DebitCardScreen from './src/screens/DebitCardScreen';
import HelppScreen from './src/screens/HelpScreen/Helpp';
import KurerScreen from './src/screens/KurerScreen';
import WinScreen from './src/screens/PaymentsScreen/vyvod';
import SplashScreen from 'react-native-splash-screen';
const Stack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(actions.userInfo());
    }
  }, [isAuthenticated, dispatch]);
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <>
      <NavigationContainer>
        {isAuthenticated ? (
          <RootStack.Navigator>
            <RootStack.Screen
              name="Drawer"
              component={Navbar}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name="Map"
              component={MapScreen}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name="DestinationScreen"
              component={ZakazScreen}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name="Bezahlmethoden"
              component={PaymentsScreen}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name="DebitCard"
              component={DebitCardScreen}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name="Helpp"
              component={HelppScreen}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="Kurer"
              component={KurerScreen}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="vyvod"
              component={WinScreen}
              options={{
                headerShown: false,
              }}
            />
          </RootStack.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              name="Authh"
              component={GlavnyScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Authhn"
              component={Glavny2Screen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Authhc"
              component={Glavny3Screen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Auth"
              component={SignInScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Forgot"
              component={ResetPasswordScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </>
  );
};

export default App;
