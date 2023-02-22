import React, {createContext, useReducer, useState} from 'react';
import {DestinationReducer, OriginReducer} from '../redux/coordinateReduser';
import GetLocation from 'react-native-get-location';

export const OriginContext = createContext();
export const DestinationContext = createContext();

export const OriginContextProvider = props => {
  const [hasLocationPermission, setHasLocationPermission] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  if (hasLocationPermission) {
    GetLocation.getCurrentPosition(
      position => {
        setHasLocationPermission(position.coords);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 1, maximumAge: 10000},
    );
  }
  const [origin, dispatchOrigin] = useReducer(OriginReducer, {
    latitude: hasLocationPermission.latitude,
    longitude: hasLocationPermission.longitude,
    address: '',
    name: '',
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  return (
    <OriginContext.Provider value={{origin, dispatchOrigin}}>
      {props.children}
    </OriginContext.Provider>
  );
};

export const DestinationContextProvider = props => {
  const [hasLocationPermission, setHasLocationPermission] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  if (hasLocationPermission) {
    Geolocation.getCurrentPosition(
      position => {
        setHasLocationPermission(position.coords);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 1, maximumAge: 10000},
    );
  }
  const [destination, dispatchDestination] = useReducer(DestinationReducer, {
    latitude: hasLocationPermission.latitude,
    longitude: hasLocationPermission.longitude,
    address: '',
    name: '',
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  return (
    <DestinationContext.Provider value={{destination, dispatchDestination}}>
      {props.children}
    </DestinationContext.Provider>
  );
};
