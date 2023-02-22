import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {colors, parameters} from '../../styles';
import {useTranslation} from 'react-i18next';
import Svg, {Path} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import MapView, {
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Marker,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_MAP_KEY} from '../../constants/googleMapKey';
import {mapStyle} from '../../styles/mapStyle';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
import avatar from '../../assets/images/icons/camera_200.png';
import {api} from '../../api';
import Geolocation from 'react-native-geolocation-service';

function MapScreen({route}) {
  const {id} = route.params;
  const [respons, setRespons] = useState({
    avatar: null,
    first_name: '',
    avatars: null,
    first_names: '',
    status1: 0,
    //в работе
    status2: 0,
    //выполнен
    status3: 0,
    status4: 0,
    status5: 0,
    messages: '',
    streets: '',
  });
  const [location, setLocation] = useState({
    initial: {
      latitude: 0,
      longitude: 0,
    },
    origin: {
      latitude: 0,
      longitude: 0,
    },
    distance: {
      latitude: 0,
      longitude: 0,
    },
  });
  const {origin, distance, initial} = location;
  const getCurrentLocation = () =>
    new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          setLocation(prevState => ({
            ...prevState,
            initial: {
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
            },
          }));
        },
        error => {
          reject(error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  const locationPermission = () =>
    new Promise(async (resolve, reject) => {
      if (Platform.OS === 'ios') {
        try {
          const permissionStatus = await Geolocation.requestAuthorization(
            'whenInUse',
          );
          if (permissionStatus === 'granted') {
            return resolve('granted');
          }
          reject('Permission not granted');
        } catch (error) {
          return reject(error);
        }
      }
      return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
        .then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve('granted');
          }
          return reject('Location Permission denied');
        })
        .catch(error => {
          return reject(error);
        });
    });
  useEffect(() => {
    getCurrentLocation();
    locationPermission();
    api
      .setzakazid(id)
      .then(response => {
        console.log(response);
        setRespons({
          avatar: response.items.avatar,
          first_name: response.items.first_name,
          //куръер
          avatars: response.items.avatars,
          first_names: response.items.first_names,
          status1: +response.items.status1,
          status2: +response.items.status2,
          status3: +response.items.status3,
          status4: +response.items.status4,
          status5: +response.items.status5,
          streets: response.items.streets,
        });
        setLocation({
          origin: {
            latitude: +response.items.latitudes,
            longitude: +response.items.longitudes,
          },
          distance: {
            longitude: +response.items.longitude,
            latitude: +response.items.latitude,
          },
        });
      })
      .catch(response => {
        setRespons({messages: response.messages});
      });
  }, []);

  const navigation = useNavigation();
  const [duration, setDuration] = React.useState('');
  const [isReady, setIsReady] = React.useState(false);
  const [angle, setAngle] = React.useState(0);
  const ref = useRef();
  const refs = useRef();
  const markerRef = useRef();

  useEffect(() => {
    refs.current?.setAddressText('');
  }, []);
  function calculateAngle(coordinates) {
    let startLat = coordinates[0].latitude;
    let startLng = coordinates[0].longitude;
    let endLat = coordinates[1].latitude;
    let endLng = coordinates[1].longitude;
    let dx = endLat - startLat;
    let dy = endLng - startLng;

    return (Math.atan2(dy, dx) * 180) / Math.PI;
  }

  return (
    <>
      {respons && (
        <>
          <View style={styles.container}>
            <View style={styles.view1}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Svg
                  fill="#335616"
                  width={30}
                  height={30}
                  focusable="false"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  data-testid="ArrowBackIcon"
                  tabIndex="-1"
                  title="ArrowBack">
                  <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </Svg>
              </TouchableOpacity>
            </View>
            {respons.status5 === 0 && origin.latitude > 0 && (
              <MapView
                ref={ref}
                initialRegion={{
                  ...origin,
                  latitudeDelta: 0.008,
                  longitudeDelta: 0.008,
                }}
                customMapStyle={mapStyle}
                style={styles.map}
                provider={
                  Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
                }
                showsUserLocation={true}
                followsUserLocation={true}>
                {origin.latitude > 0 && (
                  <Marker
                    key={'origin'}
                    ref={markerRef}
                    anchor={{x: 0.5, y: 0.5}}
                    coordinate={{
                      ...origin,
                      latitudeDelta: 0.008,
                      longitudeDelta: 0.008,
                    }}>
                    <Image
                      style={{width: 30, height: 30, borderRadius: 50}}
                      source={
                        respons?.avatar
                          ? {
                              uri: `https://kosmoss.host/api/user/${respons?.avatar}`,
                            }
                          : avatar
                      }
                    />
                  </Marker>
                )}
                {distance.latitude > 0 && (
                  <Marker
                    key={'distance'}
                    anchor={{x: 0.5, y: 0.5}}
                    ref={markerRef}
                    coordinate={{
                      ...distance,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}>
                    <Image
                      style={{width: 30, height: 30, borderRadius: 50}}
                      source={
                        respons?.avatar
                          ? {
                              uri: `https://6551eb3.online-server.cloud/api/user/${respons?.avatar}`,
                            }
                          : avatar
                      }
                    />
                  </Marker>
                )}
                <MapViewDirections
                  optimizeWaypoints={true}
                  origin={origin}
                  destination={distance}
                  apikey={GOOGLE_MAP_KEY}
                  strokeWidth={3}
                  strokeColor="red"
                  onReady={result => {
                    setDuration(Math.ceil(result.duration));
                    if (!isReady) {
                      ref.current.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                          right: colors.width * 0.1,
                          bottom: 400,
                          left: colors.width * 0.1,
                          top: colors.height * 0.1,
                        },
                      });
                      let nextLoc = {
                        latitude: result.coordinates[0].latitude,
                        longitude: result.coordinates[0].longitude,
                      };

                      if (result.coordinates.length >= 2) {
                        let angles = calculateAngle(result.coordinates);
                        setAngle(angles);
                      }
                      setLocation({...location, origin: nextLoc});
                      setIsReady(true);
                    }
                  }}
                />
              </MapView>
            )}
            {respons.status2 === 1 && initial.latitude > 0 && (
              <MapView
                ref={ref}
                initialRegion={{
                  ...initial,
                  latitudeDelta: 0.008,
                  longitudeDelta: 0.008,
                }}
                customMapStyle={mapStyle}
                style={styles.map}
                provider={
                  Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
                }
                showsUserLocation={true}
                followsUserLocation={true}>
                {initial.latitude > 0 && (
                  <Marker
                    key={'initial'}
                    ref={markerRef}
                    rotation={angle}
                    anchor={{x: 0.5, y: 0.5}}
                    title={respons.first_names}
                    coordinate={{
                      ...initial,
                      latitudeDelta: 0.008,
                      longitudeDelta: 0.008,
                    }}>
                    <Image
                      style={{width: 30, height: 30, borderRadius: 50}}
                      source={
                        respons?.avatars
                          ? {
                              uri: `https://6551eb3.online-server.cloud/api/kur/avatar/${respons?.avatars}`,
                            }
                          : avatar
                      }
                    />
                  </Marker>
                )}
                {origin.latitude > 0 && (
                  <Marker
                    key={'origin'}
                    ref={markerRef}
                    anchor={{x: 0.5, y: 0.5}}
                    rotation={angle}
                    title={respons.streets}
                    coordinate={{
                      ...origin,
                      latitudeDelta: 0.008,
                      longitudeDelta: 0.008,
                    }}>
                    <Image
                      style={{width: 30, height: 30, borderRadius: 50}}
                      source={
                        respons?.avatar
                          ? {
                              uri: `https://6551eb3.online-server.cloud/api/user/avatar/${respons?.avatar}`,
                            }
                          : avatar
                      }
                    />
                  </Marker>
                )}
                {distance.latitude > 0 && (
                  <Marker
                    key={'distance'}
                    anchor={{x: 0.5, y: 0.5}}
                    ref={markerRef}
                    rotation={angle}
                    title={respons.first_name}
                    coordinate={{
                      ...distance,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}>
                    <Image
                      style={{width: 30, height: 30, borderRadius: 50}}
                      source={
                        respons?.avatar
                          ? {
                              uri: `https://6551eb3.online-server.cloud/api/user/avatar/${respons?.avatar}`,
                            }
                          : avatar
                      }
                    />
                  </Marker>
                )}
                <MapViewDirections
                  optimizeWaypoints={true}
                  origin={initial}
                  destination={distance}
                  apikey={GOOGLE_MAP_KEY}
                  strokeWidth={3}
                  strokeColor="red"
                  onReady={result => {
                    setDuration(Math.ceil(result.duration));
                    if (!isReady) {
                      ref.current.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                          right: colors.width * 0.1,
                          bottom: 400,
                          left: colors.width * 0.1,
                          top: colors.height * 0.1,
                        },
                      });
                      let nextLoc = {
                        latitude: result.coordinates[0].latitude,
                        longitude: result.coordinates[0].longitude,
                      };

                      if (result.coordinates.length >= 2) {
                        let angles = calculateAngle(result.coordinates);
                        setAngle(angles);
                      }
                      setLocation({...location, origin: nextLoc});
                      setIsReady(true);
                    }
                  }}
                />
              </MapView>
            )}
          </View>
        </>
      )}
    </>
  );
}
const autoComplete = {
  textInput: {
    color: 'black',
    height: 50,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 15,
    flex: 1,
    borderWidth: 1,
    marginHorizontal: 15,
  },
  container: {
    paddingTop: 8,
    flex: 1,
    color: 'black',
  },

  textInputContainer: {
    flexDirection: 'row',
    color: 'black',
  },
};
const autoComplet = {
  textInput: {
    color: 'black',
    height: 50,
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 15,
    flex: 1,
    borderWidth: 1,
    marginHorizontal: 15,
  },
  container: {
    paddingTop: 8,
    flex: 1,
  },

  textInputContainer: {
    color: 'black',
    flexDirection: 'row',
  },
};

const styles = StyleSheet.create({
  container1: {flex: 1, paddingTop: parameters.statusBarHeight},

  container: {
    flex: 1,
    paddingTop: parameters.statusBarHeight,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },

  view1: {
    position: 'absolute',
    top: 25,
    left: 12,
    backgroundColor: colors.white,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    zIndex: 8,
  },

  view2: {
    height: SCREEN_HEIGHT * 0.31,
    alignItems: 'center',
    zIndex: 5,
    backgroundColor: colors.white,
  },

  view3: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 10,
    backgroundColor: colors.white,
    //height:30,
    zIndex: 10,
  },
  view4: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  view5: {
    backgroundColor: colors.grey7,
    width: SCREEN_WIDTH * 0.7,
    height: 40,
    justifyContent: 'center',
    marginTop: 10,
  },
  view6: {
    backgroundColor: colors.grey6,
    width: SCREEN_WIDTH * 0.7,
    height: 40,
    justifyContent: 'center',
    marginTop: 10,
    paddingLeft: 0,
  },
  text1: {
    marginLeft: 10,
    fontSize: 16,
    color: colors.grey1,
  },

  image1: {height: 70, width: 30, marginRight: 10, marginTop: 10},
  view7: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  view8: {
    marginLeft: 10,
  },
  view10: {
    alignItems: 'center',
    flex: 5,
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomColor: colors.grey5,
    borderBottomWidth: 1,
    paddingHorizontal: 15,
  },
  view11: {
    backgroundColor: colors.grey,
    height: 30,
    width: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    marginTop: 15,
  },

  view12: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey4,
  },

  text2: {
    fontSize: 18,
    color: colors.grey1,
  },
  text3: {
    fontSize: 16,
    color: colors.black,
    fontWeight: 'bold',
    marginRight: 5,
  },

  text4: {color: colors.grey2, marginTop: 4},

  view13: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },

  button1: {
    height: 40,
    width: 100,
    backgroundColor: colors.grey6,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  button2: {
    height: 50,
    backgroundColor: colors.grey10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 30,
  },

  button1Text: {
    fontSize: 17,
    marginTop: -2,
    color: colors.black,
  },

  button2Text: {
    color: colors.white,
    fontSize: 23,
    marginTop: -2,
  },

  view14: {
    alignItems: 'center',
    flex: 5,
    flexDirection: 'row',
  },
  view15: {
    backgroundColor: colors.grey6,
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },

  view16: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  text5: {
    fontSize: 12,
    color: colors.black,
    marginLeft: 3,
    fontWeight: 'bold',
    paddingBottom: 1,
  },

  view17: {},

  view18: {},

  view19: {flex: 1.7, alignItems: 'flex-end'},

  icon: {paddingBottom: 2},

  image2: {height: 60, width: 60},

  view20: {marginRight: 10},

  text6: {
    fontSize: 15,
    color: colors.black,
    fontWeight: 'bold',
  },

  view21: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    marginTop: 15,
  },

  view22: {
    alignItems: 'center',
    marginBottom: -20,
  },

  sectionHeaderContainer: {
    backgroundColor: 'white',
    marginTop: 30,
    paddingLeft: 15,
  },

  text7: {
    fontSize: 28,
    color: colors.black,
    marginRight: 5,
  },

  text8: {
    fontSize: 15,
    color: colors.grey2,
    textDecorationLine: 'line-through',
  },

  button3: {
    height: 60,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH - 110,
    marginBottom: 10,
  },

  view23: {
    flexDirection: 'row',
    backgroundColor: colors.cardbackground,
    // elevation:10,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    height: 80,
  },

  button2Image: {
    height: 55,
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grey6,
    marginBottom: 10,
  },
  text9: {fontSize: 15, color: colors.grey1},

  map: {
    height: '100%',
    width: '100%',
  },

  centeredView: {
    zIndex: 14,
  },
  modalView: {
    marginHorizontal: 20,
    marginVertical: 60,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 16,
  },

  view24: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    paddingHorizontal: 20,
  },

  view25: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  flatlist: {
    marginTop: 20,
  },

  text10: {color: colors.grey2, paddingLeft: 10},
});
export default MapScreen;
