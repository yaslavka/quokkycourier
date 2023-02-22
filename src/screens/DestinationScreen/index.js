import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
  Platform,
  PermissionsAndroid,
  Image,
} from 'react-native';
import moment from 'moment';
import {api} from '../../api';
import Svg, {G, Line, Path, Rect} from 'react-native-svg';
import HomeHeader from './Header';
import {formatter} from '../../utils';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from '../../actions/app.actions';
import TwoPointSlider from '../../Components/TwoPointSlider';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import isEmpty from 'lodash/isEmpty';
import Geolocation from 'react-native-geolocation-service';
import pesh from '../../assets/kur/button/Weiter5.png';
import leg from '../../assets/kur/button/Weiter6.png';
import gruz from '../../assets/kur/button/Weiter7.png';
import {
  computeDestinationPoint,
  getCenter,
  getDistance,
  getGreatCircleBearing,
  getPathLength,
  isPointInPolygon,
  isPointWithinRadius,
  orderByDistance,
} from 'geolib';

const Section = ({containerStyle, title, children}) => {
  return (
    <View
      style={{
        top: -25,
        ...containerStyle,
      }}>
      <Text style={{lineHeight: 22, fontSize: 16, color: '#0c0c0c'}}>
        {title}
      </Text>

      {children}
    </View>
  );
};

function ZakazScreen() {
  const userInfo = useSelector(state => state.app.user);
  const [zakaz, setZakaz] = useState([]);
  const [errors, setErrors] = useState();
  const [refresh, setRefresh] = useState(false);
  const [km, setKm] = useState(false);
  const [s, setS] = useState([0, 0]);
  const [matrixTypes, setMatrixTypes] = useState({
    latitude: 0,
    longitude: 0,
  });
  // console.log(s)
  const [state, setState] = useState({latitude: 0, longitude: 0});
  const dispatch = useDispatch();
  const onRefresh = async () => {
    try {
      setRefresh(true);
      api
        .getZakazy()
        .then(response => {
          setZakaz(response);
        })
        .catch(response => {
          setErrors(response.messages);
        });
      await api
        .getUserInfo()
        .then(response => {
          dispatch(actions.userInfoSuccess(response));
        })
        .catch(() => {});
    } finally {
      setRefresh(false);
    }
  };

  useEffect(() => {
    api
      .getZakazy()
      .then(respons => {
        setZakaz(respons);
        api
          .getUserInfo()
          .then(response => {
            dispatch(actions.userInfoSuccess(response));
          })
          .catch(() => {});
      })
      .catch(response => {
        setErrors(response.messages);
      });
  }, []);

  const type = number => {
    api
      .typed({type: number})
      .then(async () => {
        await api
          .getUserInfo()
          .then(response => {
            dispatch(actions.userInfoSuccess(response));
          })
          .catch(() => {});
        api
          .getZakazy()
          .then(response => {
            setZakaz(response);
          })
          .catch(response => {
            setErrors(response.messages);
          });
      })
      .catch(() => {});
  };

  const Alerts = id => {
    Alert.alert('Удаление аккаунта', 'Вы хотите удалить аккаунт?', [
      {
        text: 'Да',
        onPress: () => {
          api
            .setVzakazid(id)
            .then(() => {
              api
                .getZakaz()
                .then(response => {
                  setZakaz(response.items);
                })
                .catch(response => {
                  setErrors({...errors, messages: response.messages});
                });
            })
            .catch(reason => {
              setErrors({...errors, messages: reason.messages});
            });
        },
      },
      {
        text: 'Нет',
        onPress: () => {
          console.log('m');
        },
      },
    ]);
  };

  const getCurrentLocation = () =>
    new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          setState(prevState => ({
            ...prevState,
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
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
      .getZakazy()
      .then(respons => {
        if (!isEmpty(respons)) {
          respons.map(coords => {
            //console.log(coords);
            setMatrixTypes(prevState => ({
              ...prevState,
              latitude: +coords.latitudes,
              longitude: +coords.longitudes,
            }));
          });
        }
        api
          .getUserInfo()
          .then(response => {
            dispatch(actions.userInfoSuccess(response));
          })
          .catch(() => {});
      })
      .catch(response => {
        setErrors(response.messages);
      });
  }, []);
  const courier_lat = state.latitude;
  const courier_lon = state.longitude;
  const radius = 10;
  const filtered_orders = [matrixTypes];
  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6372.8; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var lats1 = deg2rad(lat1);
    var lats2 = deg2rad(lat2);
    var a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lats1) * Math.cos(lats2) * Math.sin(dLon / 2) ** 2;
    var c = 2 * Math.asin(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const distanceMOWBKK = getDistanceFromLatLonInKm(courier_lat, courier_lon);
  console.log();
  function renderDistance() {
    return (
      <>
        {km && (
          <Section>
            <View
              style={{
                alignItems: 'center',
              }}>
              <TwoPointSlider
                values={s}
                min={1}
                max={100}
                postfix="km"
                onValuesChange={values => setS(values)}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 40,
                top: 25,
                marginBottom: 25,
              }}>
              <TouchableOpacity
                onPress={() => {
                  type(5);
                }}>
                <Image source={pesh} style={{width: 50, height: 25}} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  type(6);
                }}>
                <Image source={leg} style={{width: 50, height: 25}} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  type(10);
                }}>
                <Image source={gruz} style={{width: 50, height: 25}} />
              </TouchableOpacity>
            </View>
          </Section>
        )}
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }>
        <View style={{}}>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity onPress={() => setKm(!km)}>
              <Svg
                width="324"
                height="70"
                viewBox="0 0 324 70"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <G filter="url(#filter0_d_0_1)">
                  <Rect
                    x="15"
                    y="11"
                    width="294"
                    height="40"
                    rx="10"
                    fill="white"
                  />
                  <Rect
                    x="15.5"
                    y="11.5"
                    width="293"
                    height="39"
                    rx="9.5"
                    stroke="#80884D"
                  />
                </G>
                <Path
                  d="M135.264 37H137.233V32.1221H140.01L142.594 37H144.871L142.023 31.8145C143.57 31.2959 144.484 29.9072 144.484 28.2021V28.1846C144.484 25.8291 142.867 24.3174 140.265 24.3174H135.264V37ZM137.233 30.5225V25.9697H140.01C141.531 25.9697 142.462 26.8311 142.462 28.2373V28.2549C142.462 29.6963 141.583 30.5225 140.072 30.5225H137.233ZM149.261 37.1582C150.527 37.1582 151.529 36.6133 152.091 35.6465H152.241V37H154.131V30.4697C154.131 28.4658 152.777 27.2705 150.378 27.2705C148.207 27.2705 146.704 28.3164 146.475 29.8809L146.466 29.9424H148.303L148.312 29.9072C148.541 29.2305 149.235 28.8438 150.29 28.8438C151.582 28.8438 152.241 29.4238 152.241 30.4697V31.3135L149.657 31.4629C147.381 31.6035 146.097 32.5967 146.097 34.3018V34.3193C146.097 36.0508 147.442 37.1582 149.261 37.1582ZM147.996 34.2402V34.2227C147.996 33.3613 148.593 32.8867 149.912 32.8076L152.241 32.6582V33.4756C152.241 34.7061 151.195 35.6377 149.771 35.6377C148.743 35.6377 147.996 35.1191 147.996 34.2402ZM159.892 37.1582C161.228 37.1582 162.274 36.543 162.828 35.4971H162.977V37H164.876V23.7109H162.977V28.9668H162.828C162.318 27.9385 161.202 27.2881 159.892 27.2881C157.467 27.2881 155.937 29.1953 155.937 32.2188V32.2363C155.937 35.2334 157.493 37.1582 159.892 37.1582ZM160.437 35.5322C158.838 35.5322 157.88 34.2842 157.88 32.2363V32.2188C157.88 30.1709 158.838 28.9229 160.437 28.9229C162.019 28.9229 163.004 30.1797 163.004 32.2188V32.2363C163.004 34.2754 162.028 35.5322 160.437 35.5322ZM168.3 25.75C168.95 25.75 169.495 25.2139 169.495 24.5635C169.495 23.9043 168.95 23.3682 168.3 23.3682C167.641 23.3682 167.105 23.9043 167.105 24.5635C167.105 25.2139 167.641 25.75 168.3 25.75ZM167.342 37H169.24V27.4551H167.342V37ZM174.791 37.1846C176.18 37.1846 177.147 36.5869 177.604 35.5586H177.753V37H179.652V27.4551H177.753V33.0537C177.753 34.5918 176.936 35.5498 175.407 35.5498C174.009 35.5498 173.429 34.7676 173.429 33.1855V27.4551H171.522V33.6338C171.522 35.8926 172.638 37.1846 174.791 37.1846ZM185.466 37.1846C187.734 37.1846 189.421 35.9805 189.421 34.2139V34.1963C189.421 32.8164 188.543 32.0342 186.706 31.6035L185.194 31.2607C184.122 31.0059 183.682 30.6367 183.682 30.0391V30.0215C183.682 29.2568 184.438 28.7383 185.484 28.7383C186.556 28.7383 187.233 29.2393 187.418 29.9072V29.9248H189.237V29.916C189.07 28.3604 187.672 27.2705 185.493 27.2705C183.331 27.2705 181.784 28.4658 181.784 30.127V30.1357C181.784 31.5332 182.619 32.3506 184.42 32.7637L185.941 33.1152C187.048 33.3701 187.497 33.7744 187.497 34.3721V34.3896C187.497 35.1719 186.679 35.708 185.501 35.708C184.368 35.708 183.673 35.2246 183.436 34.5039L183.427 34.4951H181.52V34.5039C181.705 36.1035 183.164 37.1846 185.466 37.1846Z"
                  fill="black"
                />
              </Svg>
            </TouchableOpacity>
            {renderDistance()}
          </View>
          {userInfo && (
            <>
              {!userInfo?.documents === null ||
              !userInfo?.documents?.status === false ? (
                <>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      top: 30,
                      height: 200,
                    }}>
                    <Text
                      style={{
                        color: '#80884D',
                        fontSize: 21,
                        fontWeight: 'bold',
                        paddingHorizontal: 30,
                        textAlign: 'center',
                      }}>
                      Заказы не доступны, Вы не прошли проверку личности
                    </Text>
                  </View>
                </>
              ) : (
                <View style={{alignItems: 'center', height: hp(110)}}>
                  {/*5*/}
                  {zakaz.map(
                    ({
                      id,
                      namesgruz,
                      status1,
                      street,
                      streets,
                      summ,
                      ves,
                      datetime,
                      typedostav,
                      poruchenie,
                    }) => (
                      <>
                        {userInfo.typedostav === 5 ? (
                          <>
                            {typedostav === '5' && (
                              <>
                                {status1 === false ? (
                                  <View
                                    style={{
                                      paddingHorizontal: 15,
                                      height: 'auto',
                                    }}>
                                    <TouchableOpacity
                                      style={{
                                        borderColor: '#80884D',

                                        borderWidth: 1,
                                        marginBottom: 20,
                                        borderRadius: 10,
                                      }}
                                      onPress={() => {
                                        Alerts(id);
                                      }}
                                      id={id}
                                      key={id}>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          paddingHorizontal: 10,
                                        }}>
                                        <Text
                                          style={{
                                            color: '#000000',
                                            fontWeight: 'bold',
                                            fontSize: 16,
                                          }}>
                                          {moment(datetime).format(
                                            'DD MMMM YYYY',
                                          )}
                                        </Text>
                                        <Svg
                                          style={{left: 10}}
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="96"
                                          height="52"
                                          viewBox="0 0 96 52"
                                          fill="none">
                                          <G filter="url(#filter0_d_0_1)">
                                            <Rect
                                              x="15"
                                              y="11"
                                              width="66"
                                              height="22"
                                              rx="5"
                                              fill="white"
                                            />
                                            <Rect
                                              x="15.5"
                                              y="11.5"
                                              width="65"
                                              height="21"
                                              rx="4.5"
                                              stroke="#80884D"
                                            />
                                          </G>
                                          <Path
                                            d="M36.3824 25H37.5299L38.1695 23.0957H40.8648L41.4996 25H42.6519L40.108 17.9541H38.9264L36.3824 25ZM39.4732 19.1895H39.5562L40.5719 22.2168H38.4625L39.4732 19.1895ZM43.3963 25H44.4559V23.0713L44.91 22.6172L46.7361 25H48.0252L45.6668 21.9336L47.8787 19.6973H46.6385L44.534 21.9336H44.4559V17.6172H43.3963V25ZM50.5469 25.0342C50.752 25.0342 50.9473 25.0098 51.1182 24.9805V24.1357C50.9717 24.1504 50.8789 24.1553 50.7178 24.1553C50.1953 24.1553 49.9805 23.9209 49.9805 23.3496V20.5322H51.1182V19.6973H49.9805V18.3594H48.9014V19.6973H48.0713V20.5322H48.9014V23.6035C48.9014 24.624 49.3799 25.0342 50.5469 25.0342ZM52.4973 18.75C52.8586 18.75 53.1613 18.4521 53.1613 18.0908C53.1613 17.7246 52.8586 17.4268 52.4973 17.4268C52.1311 17.4268 51.8332 17.7246 51.8332 18.0908C51.8332 18.4521 52.1311 18.75 52.4973 18.75ZM51.965 25H53.0197V19.6973H51.965V25ZM55.6147 25H56.7426L58.6567 19.6973H57.5434L56.225 23.9258H56.142L54.8188 19.6973H53.6957L55.6147 25Z"
                                            fill="#80884D"
                                          />
                                        </Svg>
                                      </View>
                                      <View
                                        style={{
                                          alignItems: 'center',
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                          paddingHorizontal: 18,
                                        }}>
                                        <Svg
                                          width="52"
                                          height="12"
                                          viewBox="0 0 52 12"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg">
                                          <Path
                                            d="M0.410156 9H1.78711L2.55469 6.71484H5.78906L6.55078 9H7.93359L4.88086 0.544922H3.46289L0.410156 9ZM4.11914 2.02734H4.21875L5.4375 5.66016H2.90625L4.11914 2.02734ZM12.2307 9.10547C13.8361 9.10547 14.8674 7.82227 14.8674 5.82422V5.8125C14.8674 3.79688 13.8479 2.52539 12.2307 2.52539C11.3576 2.52539 10.6135 2.95898 10.2736 3.64453H10.1799V0.140625H8.90841V9H10.1799V7.99805H10.2736C10.6428 8.69531 11.34 9.10547 12.2307 9.10547ZM11.8733 8.02148C10.8127 8.02148 10.1565 7.18359 10.1565 5.82422V5.8125C10.1565 4.45312 10.8127 3.61523 11.8733 3.61523C12.9338 3.61523 13.5725 4.44727 13.5725 5.8125V5.82422C13.5725 7.18945 12.9338 8.02148 11.8733 8.02148ZM16.0356 9H17.307V5.26758C17.307 4.24219 17.8871 3.60352 18.8188 3.60352C19.7504 3.60352 20.1899 4.125 20.1899 5.17969V9H21.4555V4.88086C21.4555 3.36328 20.6703 2.51367 19.2465 2.51367C18.3207 2.51367 17.7113 2.92383 17.4008 3.60352H17.307V0.140625H16.0356V9ZM25.5182 9.12305C27.3815 9.12305 28.524 7.875 28.524 5.82422V5.8125C28.524 3.76172 27.3756 2.51367 25.5182 2.51367C23.6549 2.51367 22.5065 3.76758 22.5065 5.8125V5.82422C22.5065 7.875 23.649 9.12305 25.5182 9.12305ZM25.5182 8.0625C24.4225 8.0625 23.8073 7.23633 23.8073 5.82422V5.8125C23.8073 4.40039 24.4225 3.57422 25.5182 3.57422C26.608 3.57422 27.2291 4.40039 27.2291 5.8125V5.82422C27.2291 7.23047 26.608 8.0625 25.5182 8.0625ZM29.6922 9H30.9637V0.140625H29.6922V9ZM34.5694 9.12305C35.4952 9.12305 36.1397 8.72461 36.4444 8.03906H36.544V9H37.8096V2.63672H36.544V6.36914C36.544 7.39453 35.9991 8.0332 34.9795 8.0332C34.0479 8.0332 33.6612 7.51172 33.6612 6.45703V2.63672H32.3897V6.75586C32.3897 8.26172 33.1338 9.12305 34.5694 9.12305ZM39.2356 9H40.5071V5.26758C40.5071 4.24219 41.0872 3.60352 42.0188 3.60352C42.9504 3.60352 43.3899 4.125 43.3899 5.17969V9H44.6555V4.88086C44.6555 3.36328 43.8704 2.51367 42.4465 2.51367C41.5208 2.51367 40.9114 2.92383 40.6008 3.60352H40.5071V2.63672H39.2356V9ZM48.7124 11.2441C50.517 11.2441 51.6596 10.3184 51.6596 8.87109V2.63672H50.394V3.67969H50.3178C49.9487 2.96484 49.2573 2.52539 48.3667 2.52539C46.7143 2.52539 45.7006 3.80859 45.7006 5.625V5.63672C45.7006 7.42969 46.7085 8.68945 48.3432 8.68945C49.2163 8.68945 49.9194 8.30273 50.3061 7.61133H50.3999V8.86523C50.3999 9.73242 49.7788 10.2246 48.7299 10.2246C47.8686 10.2246 47.353 9.91406 47.2475 9.47461L47.2417 9.46289H45.9585L45.9467 9.47461C46.0991 10.5352 47.0952 11.2441 48.7124 11.2441ZM48.6948 7.64062C47.6108 7.64062 47.0014 6.81445 47.0014 5.63086V5.61914C47.0014 4.43555 47.6108 3.60352 48.6948 3.60352C49.767 3.60352 50.4233 4.43555 50.4233 5.61914V5.63086C50.4233 6.82031 49.7729 7.64062 48.6948 7.64062Z"
                                            fill="#B3B3B3"
                                          />
                                        </Svg>
                                        <Svg
                                          width="15"
                                          height="15"
                                          viewBox="0 0 15 15"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg">
                                          <Path
                                            d="M10.8 6.53123L13.125 4.20623M13.125 4.20623L10.8 1.88123M13.125 4.20623H1.875M4.2 8.46873L1.875 10.7937M1.875 10.7937L4.2 13.1187M1.875 10.7937H13.125"
                                            stroke="#B3B3B3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </Svg>
                                        <Svg
                                          width="50"
                                          height="13"
                                          viewBox="0 0 50 13"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg">
                                          <Path
                                            d="M0.0605469 10H5.33398V8.86914H1.37305V1.54492H0.0605469V10ZM7.10567 2.5C7.53927 2.5 7.90255 2.14258 7.90255 1.70898C7.90255 1.26953 7.53927 0.912109 7.10567 0.912109C6.66622 0.912109 6.3088 1.26953 6.3088 1.70898C6.3088 2.14258 6.66622 2.5 7.10567 2.5ZM6.467 10H7.73263V3.63672H6.467V10ZM11.8481 10.123C13.477 10.123 14.3559 9.18555 14.5668 8.34766L14.5785 8.29492L13.3539 8.30078L13.3305 8.34766C13.1781 8.67578 12.6918 9.08008 11.8774 9.08008C10.8285 9.08008 10.1606 8.37109 10.1371 7.15234H14.6488V6.70703C14.6488 4.79688 13.559 3.51367 11.7836 3.51367C10.0082 3.51367 8.85978 4.84375 8.85978 6.83008V6.83594C8.85978 8.85156 9.98478 10.123 11.8481 10.123ZM11.7895 4.55664C12.6508 4.55664 13.2895 5.10742 13.3891 6.24414H10.1547C10.266 5.14844 10.9223 4.55664 11.7895 4.55664ZM16.2037 10H17.4694V4.63867H18.8698V3.63672H17.4576V3.02734C17.4576 2.38281 17.733 2.04297 18.4362 2.04297C18.6354 2.04297 18.8053 2.05469 18.9225 2.07227V1.14062C18.7057 1.10547 18.4596 1.08203 18.1725 1.08203C16.8483 1.08203 16.2037 1.70312 16.2037 2.96875V3.63672H15.1549V4.63867H16.2037V10ZM22.3172 10.123C23.9461 10.123 24.825 9.18555 25.036 8.34766L25.0477 8.29492L23.8231 8.30078L23.7996 8.34766C23.6473 8.67578 23.161 9.08008 22.3465 9.08008C21.2977 9.08008 20.6297 8.37109 20.6063 7.15234H25.118V6.70703C25.118 4.79688 24.0282 3.51367 22.2528 3.51367C20.4774 3.51367 19.3289 4.84375 19.3289 6.83008V6.83594C19.3289 8.85156 20.4539 10.123 22.3172 10.123ZM22.2586 4.55664C23.12 4.55664 23.7586 5.10742 23.8582 6.24414H20.6239C20.7352 5.14844 21.3914 4.55664 22.2586 4.55664ZM26.2217 10H27.4932V6.19727C27.4932 5.27734 28.1553 4.67969 29.128 4.67969C29.3682 4.67969 29.585 4.70898 29.8135 4.75586V3.58398C29.6846 3.55469 29.462 3.52539 29.2569 3.52539C28.4073 3.52539 27.8155 3.92383 27.587 4.59766H27.4932V3.63672H26.2217V10ZM32.7395 10.123C33.6653 10.123 34.3098 9.72461 34.6145 9.03906H34.7141V10H35.9797V3.63672H34.7141V7.36914C34.7141 8.39453 34.1692 9.0332 33.1497 9.0332C32.218 9.0332 31.8313 8.51172 31.8313 7.45703V3.63672H30.5598V7.75586C30.5598 9.26172 31.304 10.123 32.7395 10.123ZM37.4057 10H38.6772V6.26758C38.6772 5.24219 39.2573 4.60352 40.1889 4.60352C41.1206 4.60352 41.56 5.125 41.56 6.17969V10H42.8256V5.88086C42.8256 4.36328 42.0405 3.51367 40.6167 3.51367C39.6909 3.51367 39.0815 3.92383 38.771 4.60352H38.6772V3.63672H37.4057V10ZM46.8825 12.2441C48.6872 12.2441 49.8298 11.3184 49.8298 9.87109V3.63672H48.5641V4.67969H48.488C48.1188 3.96484 47.4274 3.52539 46.5368 3.52539C44.8844 3.52539 43.8708 4.80859 43.8708 6.625V6.63672C43.8708 8.42969 44.8786 9.68945 46.5133 9.68945C47.3864 9.68945 48.0895 9.30273 48.4762 8.61133H48.57V9.86523C48.57 10.7324 47.9489 11.2246 46.9001 11.2246C46.0387 11.2246 45.5231 10.9141 45.4176 10.4746L45.4118 10.4629H44.1286L44.1169 10.4746C44.2692 11.5352 45.2653 12.2441 46.8825 12.2441ZM46.8649 8.64062C45.7809 8.64062 45.1715 7.81445 45.1715 6.63086V6.61914C45.1715 5.43555 45.7809 4.60352 46.8649 4.60352C47.9372 4.60352 48.5934 5.43555 48.5934 6.61914V6.63086C48.5934 7.82031 47.943 8.64062 46.8649 8.64062Z"
                                            fill="#B3B3B3"
                                          />
                                        </Svg>
                                      </View>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                        }}>
                                        <View
                                          style={{
                                            width: 124,
                                            height: 34,
                                            left: 17,
                                          }}>
                                          <Text
                                            style={{
                                              fontSize: 12,
                                              fontWeight: 'bold',
                                              textAlign: 'left',
                                            }}>
                                            {streets}
                                          </Text>
                                        </View>
                                        <View
                                          style={{
                                            width: 75,
                                            height: 34,
                                            right: 17,
                                          }}>
                                          <Text
                                            style={{
                                              fontSize: 12,
                                              fontWeight: 'bold',
                                              textAlign: 'right',
                                            }}>
                                            {street}
                                          </Text>
                                        </View>
                                      </View>
                                      <View
                                        style={{
                                          paddingHorizontal: 20,
                                          marginBottom: 20,
                                        }}>
                                        <View
                                          style={{
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            borderColor: '#80884D',
                                          }}>
                                          <Text
                                            style={{
                                              color: '#80884D',
                                              textAlign: 'center',
                                            }}>
                                            {poruchenie}
                                          </Text>
                                        </View>
                                      </View>
                                      <View
                                        style={{
                                          alignItems: 'center',
                                          marginBottom: 20,
                                        }}>
                                        <Svg
                                          width="295"
                                          height="1"
                                          viewBox="0 0 295 1"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg">
                                          <Line
                                            y1="0.5"
                                            x2="295"
                                            y2="0.5"
                                            stroke="#80884D"
                                            strokeOpacity="0.6"
                                          />
                                        </Svg>
                                      </View>
                                      <View
                                        style={{
                                          alignItems: 'center',
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                          paddingHorizontal: 15,
                                          marginBottom: 20,
                                        }}>
                                        <Svg
                                          width="49"
                                          height="12"
                                          viewBox="0 0 49 12"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg">
                                          <Path
                                            d="M3.91992 9.20508C5.88867 9.20508 7.14844 8.19727 7.14844 6.58008V6.57422C7.14844 5.32031 6.42188 4.60547 4.64648 4.22461L3.72656 4.01953C2.63086 3.78516 2.18555 3.375 2.18555 2.74805V2.74219C2.18555 1.94531 2.91797 1.48242 3.9082 1.48242C4.93359 1.47656 5.5957 1.98047 5.70703 2.67188L5.71875 2.74805H6.99023L6.98438 2.66602C6.89062 1.35352 5.71875 0.339844 3.92578 0.339844C2.13281 0.339844 0.867188 1.34766 0.861328 2.80664V2.8125C0.861328 4.06055 1.59961 4.85742 3.31641 5.2207L4.24219 5.41992C5.36133 5.66016 5.81836 6.08203 5.81836 6.73242V6.73828C5.81836 7.52344 5.05078 8.0625 3.97266 8.0625C2.8418 8.0625 2.02734 7.57031 1.95703 6.80273L1.95117 6.73828H0.662109L0.667969 6.81445C0.785156 8.23828 2.00977 9.20508 3.91992 9.20508ZM10.9943 9.12305C12.6233 9.12305 13.5022 8.18555 13.7131 7.34766L13.7248 7.29492L12.5002 7.30078L12.4768 7.34766C12.3244 7.67578 11.8381 8.08008 11.0236 8.08008C9.97481 8.08008 9.30684 7.37109 9.28341 6.15234H13.7951V5.70703C13.7951 3.79688 12.7053 2.51367 10.9299 2.51367C9.1545 2.51367 8.00606 3.84375 8.00606 5.83008V5.83594C8.00606 7.85156 9.13106 9.12305 10.9943 9.12305ZM10.9358 3.55664C11.7971 3.55664 12.4358 4.10742 12.5354 5.24414H9.30098C9.41231 4.14844 10.0686 3.55664 10.9358 3.55664ZM14.8988 9H16.1703V5.26758C16.1703 4.24219 16.7504 3.60352 17.682 3.60352C18.6137 3.60352 19.0531 4.125 19.0531 5.17969V9H20.3188V4.88086C20.3188 3.36328 19.5336 2.51367 18.1098 2.51367C17.184 2.51367 16.5746 2.92383 16.2641 3.60352H16.1703V2.63672H14.8988V9ZM24.0065 9.10547C24.8971 9.10547 25.5944 8.69531 25.9635 7.99805H26.0631V9H27.3287V0.140625H26.0631V3.64453H25.9635C25.6237 2.95898 24.8795 2.52539 24.0065 2.52539C22.3893 2.52539 21.3698 3.79688 21.3698 5.8125V5.82422C21.3698 7.82227 22.4069 9.10547 24.0065 9.10547ZM24.3698 8.02148C23.3033 8.02148 22.6647 7.18945 22.6647 5.82422V5.8125C22.6647 4.44727 23.3033 3.61523 24.3698 3.61523C25.4244 3.61523 26.0807 4.45312 26.0807 5.8125V5.82422C26.0807 7.18359 25.4303 8.02148 24.3698 8.02148ZM30.9344 9.12305C31.8602 9.12305 32.5047 8.72461 32.8094 8.03906H32.909V9H34.1746V2.63672H32.909V6.36914C32.909 7.39453 32.3641 8.0332 31.3446 8.0332C30.4129 8.0332 30.0262 7.51172 30.0262 6.45703V2.63672H28.7547V6.75586C28.7547 8.26172 29.4989 9.12305 30.9344 9.12305ZM35.6006 9H36.8721V5.26758C36.8721 4.24219 37.4522 3.60352 38.3838 3.60352C39.3155 3.60352 39.7549 4.125 39.7549 5.17969V9H41.0205V4.88086C41.0205 3.36328 40.2354 2.51367 38.8116 2.51367C37.8858 2.51367 37.2764 2.92383 36.9659 3.60352H36.8721V2.63672H35.6006V9ZM45.0774 11.2441C46.8821 11.2441 48.0247 10.3184 48.0247 8.87109V2.63672H46.759V3.67969H46.6829C46.3137 2.96484 45.6223 2.52539 44.7317 2.52539C43.0793 2.52539 42.0657 3.80859 42.0657 5.625V5.63672C42.0657 7.42969 43.0735 8.68945 44.7083 8.68945C45.5813 8.68945 46.2844 8.30273 46.6711 7.61133H46.7649V8.86523C46.7649 9.73242 46.1438 10.2246 45.095 10.2246C44.2336 10.2246 43.718 9.91406 43.6125 9.47461L43.6067 9.46289H42.3235L42.3118 9.47461C42.4641 10.5352 43.4602 11.2441 45.0774 11.2441ZM45.0598 7.64062C43.9758 7.64062 43.3665 6.81445 43.3665 5.63086V5.61914C43.3665 4.43555 43.9758 3.60352 45.0598 3.60352C46.1321 3.60352 46.7883 4.43555 46.7883 5.61914V5.63086C46.7883 6.82031 46.1379 7.64062 45.0598 7.64062Z"
                                            fill="#B3B3B3"
                                          />
                                        </Svg>
                                        <Text>{ves} kg</Text>
                                      </View>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          paddingHorizontal: 15,
                                          marginBottom: 15,
                                        }}>
                                        <View>
                                          <Text>{namesgruz}</Text>
                                        </View>
                                        <View>
                                          <Text>
                                            {formatter
                                              .format(summ || 0)
                                              .replace('₽', '€')}
                                          </Text>
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                ) : (
                                  <></>
                                )}
                              </>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    ),
                  )}

                  {/*6*/}
                  {zakaz.map(
                    ({
                      id,
                      namesgruz,
                      status1,
                      street,
                      streets,
                      summ,
                      ves,
                      datetime,
                      typedostav,
                      poruchenie,
                    }) => (
                      <>
                        {userInfo.typedostav === 6 ? (
                          <>
                            {typedostav === '6' && (
                              <>
                                {status1 === false ? (
                                  <View
                                    style={{
                                      paddingHorizontal: 15,
                                      height: 'auto',
                                    }}>
                                    <TouchableOpacity
                                      style={{
                                        borderColor: '#80884D',

                                        borderWidth: 1,
                                        marginBottom: 20,
                                        borderRadius: 10,
                                      }}
                                      onPress={() => {
                                        Alerts(id);
                                      }}
                                      id={id}
                                      key={id}>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          paddingHorizontal: 10,
                                        }}>
                                        <Text
                                          style={{
                                            color: '#000000',
                                            fontWeight: 'bold',
                                            fontSize: 16,
                                          }}>
                                          {moment(datetime).format(
                                            'DD MMMM YYYY',
                                          )}
                                        </Text>
                                        <Svg
                                          style={{left: 10}}
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="96"
                                          height="52"
                                          viewBox="0 0 96 52"
                                          fill="none">
                                          <G filter="url(#filter0_d_0_1)">
                                            <Rect
                                              x="15"
                                              y="11"
                                              width="66"
                                              height="22"
                                              rx="5"
                                              fill="white"
                                            />
                                            <Rect
                                              x="15.5"
                                              y="11.5"
                                              width="65"
                                              height="21"
                                              rx="4.5"
                                              stroke="#80884D"
                                            />
                                          </G>
                                          <Path
                                            d="M36.3824 25H37.5299L38.1695 23.0957H40.8648L41.4996 25H42.6519L40.108 17.9541H38.9264L36.3824 25ZM39.4732 19.1895H39.5562L40.5719 22.2168H38.4625L39.4732 19.1895ZM43.3963 25H44.4559V23.0713L44.91 22.6172L46.7361 25H48.0252L45.6668 21.9336L47.8787 19.6973H46.6385L44.534 21.9336H44.4559V17.6172H43.3963V25ZM50.5469 25.0342C50.752 25.0342 50.9473 25.0098 51.1182 24.9805V24.1357C50.9717 24.1504 50.8789 24.1553 50.7178 24.1553C50.1953 24.1553 49.9805 23.9209 49.9805 23.3496V20.5322H51.1182V19.6973H49.9805V18.3594H48.9014V19.6973H48.0713V20.5322H48.9014V23.6035C48.9014 24.624 49.3799 25.0342 50.5469 25.0342ZM52.4973 18.75C52.8586 18.75 53.1613 18.4521 53.1613 18.0908C53.1613 17.7246 52.8586 17.4268 52.4973 17.4268C52.1311 17.4268 51.8332 17.7246 51.8332 18.0908C51.8332 18.4521 52.1311 18.75 52.4973 18.75ZM51.965 25H53.0197V19.6973H51.965V25ZM55.6147 25H56.7426L58.6567 19.6973H57.5434L56.225 23.9258H56.142L54.8188 19.6973H53.6957L55.6147 25Z"
                                            fill="#80884D"
                                          />
                                        </Svg>
                                      </View>
                                      <View
                                        style={{
                                          alignItems: 'center',
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                          paddingHorizontal: 18,
                                        }}>
                                        <Svg
                                          width="52"
                                          height="12"
                                          viewBox="0 0 52 12"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg">
                                          <Path
                                            d="M0.410156 9H1.78711L2.55469 6.71484H5.78906L6.55078 9H7.93359L4.88086 0.544922H3.46289L0.410156 9ZM4.11914 2.02734H4.21875L5.4375 5.66016H2.90625L4.11914 2.02734ZM12.2307 9.10547C13.8361 9.10547 14.8674 7.82227 14.8674 5.82422V5.8125C14.8674 3.79688 13.8479 2.52539 12.2307 2.52539C11.3576 2.52539 10.6135 2.95898 10.2736 3.64453H10.1799V0.140625H8.90841V9H10.1799V7.99805H10.2736C10.6428 8.69531 11.34 9.10547 12.2307 9.10547ZM11.8733 8.02148C10.8127 8.02148 10.1565 7.18359 10.1565 5.82422V5.8125C10.1565 4.45312 10.8127 3.61523 11.8733 3.61523C12.9338 3.61523 13.5725 4.44727 13.5725 5.8125V5.82422C13.5725 7.18945 12.9338 8.02148 11.8733 8.02148ZM16.0356 9H17.307V5.26758C17.307 4.24219 17.8871 3.60352 18.8188 3.60352C19.7504 3.60352 20.1899 4.125 20.1899 5.17969V9H21.4555V4.88086C21.4555 3.36328 20.6703 2.51367 19.2465 2.51367C18.3207 2.51367 17.7113 2.92383 17.4008 3.60352H17.307V0.140625H16.0356V9ZM25.5182 9.12305C27.3815 9.12305 28.524 7.875 28.524 5.82422V5.8125C28.524 3.76172 27.3756 2.51367 25.5182 2.51367C23.6549 2.51367 22.5065 3.76758 22.5065 5.8125V5.82422C22.5065 7.875 23.649 9.12305 25.5182 9.12305ZM25.5182 8.0625C24.4225 8.0625 23.8073 7.23633 23.8073 5.82422V5.8125C23.8073 4.40039 24.4225 3.57422 25.5182 3.57422C26.608 3.57422 27.2291 4.40039 27.2291 5.8125V5.82422C27.2291 7.23047 26.608 8.0625 25.5182 8.0625ZM29.6922 9H30.9637V0.140625H29.6922V9ZM34.5694 9.12305C35.4952 9.12305 36.1397 8.72461 36.4444 8.03906H36.544V9H37.8096V2.63672H36.544V6.36914C36.544 7.39453 35.9991 8.0332 34.9795 8.0332C34.0479 8.0332 33.6612 7.51172 33.6612 6.45703V2.63672H32.3897V6.75586C32.3897 8.26172 33.1338 9.12305 34.5694 9.12305ZM39.2356 9H40.5071V5.26758C40.5071 4.24219 41.0872 3.60352 42.0188 3.60352C42.9504 3.60352 43.3899 4.125 43.3899 5.17969V9H44.6555V4.88086C44.6555 3.36328 43.8704 2.51367 42.4465 2.51367C41.5208 2.51367 40.9114 2.92383 40.6008 3.60352H40.5071V2.63672H39.2356V9ZM48.7124 11.2441C50.517 11.2441 51.6596 10.3184 51.6596 8.87109V2.63672H50.394V3.67969H50.3178C49.9487 2.96484 49.2573 2.52539 48.3667 2.52539C46.7143 2.52539 45.7006 3.80859 45.7006 5.625V5.63672C45.7006 7.42969 46.7085 8.68945 48.3432 8.68945C49.2163 8.68945 49.9194 8.30273 50.3061 7.61133H50.3999V8.86523C50.3999 9.73242 49.7788 10.2246 48.7299 10.2246C47.8686 10.2246 47.353 9.91406 47.2475 9.47461L47.2417 9.46289H45.9585L45.9467 9.47461C46.0991 10.5352 47.0952 11.2441 48.7124 11.2441ZM48.6948 7.64062C47.6108 7.64062 47.0014 6.81445 47.0014 5.63086V5.61914C47.0014 4.43555 47.6108 3.60352 48.6948 3.60352C49.767 3.60352 50.4233 4.43555 50.4233 5.61914V5.63086C50.4233 6.82031 49.7729 7.64062 48.6948 7.64062Z"
                                            fill="#B3B3B3"
                                          />
                                        </Svg>
                                        <Svg
                                          width="15"
                                          height="15"
                                          viewBox="0 0 15 15"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg">
                                          <Path
                                            d="M10.8 6.53123L13.125 4.20623M13.125 4.20623L10.8 1.88123M13.125 4.20623H1.875M4.2 8.46873L1.875 10.7937M1.875 10.7937L4.2 13.1187M1.875 10.7937H13.125"
                                            stroke="#B3B3B3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </Svg>
                                        <Svg
                                          width="50"
                                          height="13"
                                          viewBox="0 0 50 13"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg">
                                          <Path
                                            d="M0.0605469 10H5.33398V8.86914H1.37305V1.54492H0.0605469V10ZM7.10567 2.5C7.53927 2.5 7.90255 2.14258 7.90255 1.70898C7.90255 1.26953 7.53927 0.912109 7.10567 0.912109C6.66622 0.912109 6.3088 1.26953 6.3088 1.70898C6.3088 2.14258 6.66622 2.5 7.10567 2.5ZM6.467 10H7.73263V3.63672H6.467V10ZM11.8481 10.123C13.477 10.123 14.3559 9.18555 14.5668 8.34766L14.5785 8.29492L13.3539 8.30078L13.3305 8.34766C13.1781 8.67578 12.6918 9.08008 11.8774 9.08008C10.8285 9.08008 10.1606 8.37109 10.1371 7.15234H14.6488V6.70703C14.6488 4.79688 13.559 3.51367 11.7836 3.51367C10.0082 3.51367 8.85978 4.84375 8.85978 6.83008V6.83594C8.85978 8.85156 9.98478 10.123 11.8481 10.123ZM11.7895 4.55664C12.6508 4.55664 13.2895 5.10742 13.3891 6.24414H10.1547C10.266 5.14844 10.9223 4.55664 11.7895 4.55664ZM16.2037 10H17.4694V4.63867H18.8698V3.63672H17.4576V3.02734C17.4576 2.38281 17.733 2.04297 18.4362 2.04297C18.6354 2.04297 18.8053 2.05469 18.9225 2.07227V1.14062C18.7057 1.10547 18.4596 1.08203 18.1725 1.08203C16.8483 1.08203 16.2037 1.70312 16.2037 2.96875V3.63672H15.1549V4.63867H16.2037V10ZM22.3172 10.123C23.9461 10.123 24.825 9.18555 25.036 8.34766L25.0477 8.29492L23.8231 8.30078L23.7996 8.34766C23.6473 8.67578 23.161 9.08008 22.3465 9.08008C21.2977 9.08008 20.6297 8.37109 20.6063 7.15234H25.118V6.70703C25.118 4.79688 24.0282 3.51367 22.2528 3.51367C20.4774 3.51367 19.3289 4.84375 19.3289 6.83008V6.83594C19.3289 8.85156 20.4539 10.123 22.3172 10.123ZM22.2586 4.55664C23.12 4.55664 23.7586 5.10742 23.8582 6.24414H20.6239C20.7352 5.14844 21.3914 4.55664 22.2586 4.55664ZM26.2217 10H27.4932V6.19727C27.4932 5.27734 28.1553 4.67969 29.128 4.67969C29.3682 4.67969 29.585 4.70898 29.8135 4.75586V3.58398C29.6846 3.55469 29.462 3.52539 29.2569 3.52539C28.4073 3.52539 27.8155 3.92383 27.587 4.59766H27.4932V3.63672H26.2217V10ZM32.7395 10.123C33.6653 10.123 34.3098 9.72461 34.6145 9.03906H34.7141V10H35.9797V3.63672H34.7141V7.36914C34.7141 8.39453 34.1692 9.0332 33.1497 9.0332C32.218 9.0332 31.8313 8.51172 31.8313 7.45703V3.63672H30.5598V7.75586C30.5598 9.26172 31.304 10.123 32.7395 10.123ZM37.4057 10H38.6772V6.26758C38.6772 5.24219 39.2573 4.60352 40.1889 4.60352C41.1206 4.60352 41.56 5.125 41.56 6.17969V10H42.8256V5.88086C42.8256 4.36328 42.0405 3.51367 40.6167 3.51367C39.6909 3.51367 39.0815 3.92383 38.771 4.60352H38.6772V3.63672H37.4057V10ZM46.8825 12.2441C48.6872 12.2441 49.8298 11.3184 49.8298 9.87109V3.63672H48.5641V4.67969H48.488C48.1188 3.96484 47.4274 3.52539 46.5368 3.52539C44.8844 3.52539 43.8708 4.80859 43.8708 6.625V6.63672C43.8708 8.42969 44.8786 9.68945 46.5133 9.68945C47.3864 9.68945 48.0895 9.30273 48.4762 8.61133H48.57V9.86523C48.57 10.7324 47.9489 11.2246 46.9001 11.2246C46.0387 11.2246 45.5231 10.9141 45.4176 10.4746L45.4118 10.4629H44.1286L44.1169 10.4746C44.2692 11.5352 45.2653 12.2441 46.8825 12.2441ZM46.8649 8.64062C45.7809 8.64062 45.1715 7.81445 45.1715 6.63086V6.61914C45.1715 5.43555 45.7809 4.60352 46.8649 4.60352C47.9372 4.60352 48.5934 5.43555 48.5934 6.61914V6.63086C48.5934 7.82031 47.943 8.64062 46.8649 8.64062Z"
                                            fill="#B3B3B3"
                                          />
                                        </Svg>
                                      </View>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                        }}>
                                        <View
                                          style={{
                                            width: 124,
                                            height: 34,
                                            left: 17,
                                          }}>
                                          <Text
                                            style={{
                                              fontSize: 12,
                                              fontWeight: 'bold',
                                              textAlign: 'left',
                                            }}>
                                            {streets}
                                          </Text>
                                        </View>
                                        <View
                                          style={{
                                            width: 75,
                                            height: 34,
                                            right: 17,
                                          }}>
                                          <Text
                                            style={{
                                              fontSize: 12,
                                              fontWeight: 'bold',
                                              textAlign: 'right',
                                            }}>
                                            {street}
                                          </Text>
                                        </View>
                                      </View>
                                      <View
                                        style={{
                                          paddingHorizontal: 20,
                                          marginBottom: 20,
                                        }}>
                                        <View
                                          style={{
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            borderColor: '#80884D',
                                          }}>
                                          <Text
                                            style={{
                                              color: '#80884D',
                                              textAlign: 'center',
                                            }}>
                                            {poruchenie}
                                          </Text>
                                        </View>
                                      </View>
                                      <View
                                        style={{
                                          alignItems: 'center',
                                          marginBottom: 20,
                                        }}>
                                        <Svg
                                          width="295"
                                          height="1"
                                          viewBox="0 0 295 1"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg">
                                          <Line
                                            y1="0.5"
                                            x2="295"
                                            y2="0.5"
                                            stroke="#80884D"
                                            strokeOpacity="0.6"
                                          />
                                        </Svg>
                                      </View>
                                      <View
                                        style={{
                                          alignItems: 'center',
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                          paddingHorizontal: 15,
                                          marginBottom: 20,
                                        }}>
                                        <Svg
                                          width="49"
                                          height="12"
                                          viewBox="0 0 49 12"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg">
                                          <Path
                                            d="M3.91992 9.20508C5.88867 9.20508 7.14844 8.19727 7.14844 6.58008V6.57422C7.14844 5.32031 6.42188 4.60547 4.64648 4.22461L3.72656 4.01953C2.63086 3.78516 2.18555 3.375 2.18555 2.74805V2.74219C2.18555 1.94531 2.91797 1.48242 3.9082 1.48242C4.93359 1.47656 5.5957 1.98047 5.70703 2.67188L5.71875 2.74805H6.99023L6.98438 2.66602C6.89062 1.35352 5.71875 0.339844 3.92578 0.339844C2.13281 0.339844 0.867188 1.34766 0.861328 2.80664V2.8125C0.861328 4.06055 1.59961 4.85742 3.31641 5.2207L4.24219 5.41992C5.36133 5.66016 5.81836 6.08203 5.81836 6.73242V6.73828C5.81836 7.52344 5.05078 8.0625 3.97266 8.0625C2.8418 8.0625 2.02734 7.57031 1.95703 6.80273L1.95117 6.73828H0.662109L0.667969 6.81445C0.785156 8.23828 2.00977 9.20508 3.91992 9.20508ZM10.9943 9.12305C12.6233 9.12305 13.5022 8.18555 13.7131 7.34766L13.7248 7.29492L12.5002 7.30078L12.4768 7.34766C12.3244 7.67578 11.8381 8.08008 11.0236 8.08008C9.97481 8.08008 9.30684 7.37109 9.28341 6.15234H13.7951V5.70703C13.7951 3.79688 12.7053 2.51367 10.9299 2.51367C9.1545 2.51367 8.00606 3.84375 8.00606 5.83008V5.83594C8.00606 7.85156 9.13106 9.12305 10.9943 9.12305ZM10.9358 3.55664C11.7971 3.55664 12.4358 4.10742 12.5354 5.24414H9.30098C9.41231 4.14844 10.0686 3.55664 10.9358 3.55664ZM14.8988 9H16.1703V5.26758C16.1703 4.24219 16.7504 3.60352 17.682 3.60352C18.6137 3.60352 19.0531 4.125 19.0531 5.17969V9H20.3188V4.88086C20.3188 3.36328 19.5336 2.51367 18.1098 2.51367C17.184 2.51367 16.5746 2.92383 16.2641 3.60352H16.1703V2.63672H14.8988V9ZM24.0065 9.10547C24.8971 9.10547 25.5944 8.69531 25.9635 7.99805H26.0631V9H27.3287V0.140625H26.0631V3.64453H25.9635C25.6237 2.95898 24.8795 2.52539 24.0065 2.52539C22.3893 2.52539 21.3698 3.79688 21.3698 5.8125V5.82422C21.3698 7.82227 22.4069 9.10547 24.0065 9.10547ZM24.3698 8.02148C23.3033 8.02148 22.6647 7.18945 22.6647 5.82422V5.8125C22.6647 4.44727 23.3033 3.61523 24.3698 3.61523C25.4244 3.61523 26.0807 4.45312 26.0807 5.8125V5.82422C26.0807 7.18359 25.4303 8.02148 24.3698 8.02148ZM30.9344 9.12305C31.8602 9.12305 32.5047 8.72461 32.8094 8.03906H32.909V9H34.1746V2.63672H32.909V6.36914C32.909 7.39453 32.3641 8.0332 31.3446 8.0332C30.4129 8.0332 30.0262 7.51172 30.0262 6.45703V2.63672H28.7547V6.75586C28.7547 8.26172 29.4989 9.12305 30.9344 9.12305ZM35.6006 9H36.8721V5.26758C36.8721 4.24219 37.4522 3.60352 38.3838 3.60352C39.3155 3.60352 39.7549 4.125 39.7549 5.17969V9H41.0205V4.88086C41.0205 3.36328 40.2354 2.51367 38.8116 2.51367C37.8858 2.51367 37.2764 2.92383 36.9659 3.60352H36.8721V2.63672H35.6006V9ZM45.0774 11.2441C46.8821 11.2441 48.0247 10.3184 48.0247 8.87109V2.63672H46.759V3.67969H46.6829C46.3137 2.96484 45.6223 2.52539 44.7317 2.52539C43.0793 2.52539 42.0657 3.80859 42.0657 5.625V5.63672C42.0657 7.42969 43.0735 8.68945 44.7083 8.68945C45.5813 8.68945 46.2844 8.30273 46.6711 7.61133H46.7649V8.86523C46.7649 9.73242 46.1438 10.2246 45.095 10.2246C44.2336 10.2246 43.718 9.91406 43.6125 9.47461L43.6067 9.46289H42.3235L42.3118 9.47461C42.4641 10.5352 43.4602 11.2441 45.0774 11.2441ZM45.0598 7.64062C43.9758 7.64062 43.3665 6.81445 43.3665 5.63086V5.61914C43.3665 4.43555 43.9758 3.60352 45.0598 3.60352C46.1321 3.60352 46.7883 4.43555 46.7883 5.61914V5.63086C46.7883 6.82031 46.1379 7.64062 45.0598 7.64062Z"
                                            fill="#B3B3B3"
                                          />
                                        </Svg>
                                        <Text>{ves} kg</Text>
                                      </View>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          paddingHorizontal: 15,
                                          marginBottom: 15,
                                        }}>
                                        <View>
                                          <Text>{namesgruz}</Text>
                                        </View>
                                        <View>
                                          <Text>
                                            {formatter
                                              .format(summ || 0)
                                              .replace('₽', '€')}
                                          </Text>
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                ) : (
                                  <></>
                                )}
                              </>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    ),
                  )}
                  {/*10*/}
                  {zakaz.map(
                    ({
                      id,
                      namesgruz,
                      status1,
                      street,
                      streets,
                      summ,
                      ves,
                      datetime,
                      typedostav,
                      poruchenie,
                    }) => (
                      <>
                        {userInfo.typedostav === 10 ? (
                          <>
                            {typedostav === '10' && (
                              <>
                                {status1 === false ? (
                                  <View
                                    style={{
                                      paddingHorizontal: 15,
                                      height: 'auto',
                                    }}>
                                    <TouchableOpacity
                                      style={{
                                        borderColor: '#80884D',

                                        borderWidth: 1,
                                        marginBottom: 20,
                                        borderRadius: 10,
                                      }}
                                      onPress={() => {
                                        Alerts(id);
                                      }}
                                      id={id}
                                      key={id}>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          paddingHorizontal: 10,
                                        }}>
                                        <Text
                                          style={{
                                            color: '#000000',
                                            fontWeight: 'bold',
                                            fontSize: 16,
                                          }}>
                                          {moment(datetime).format(
                                            'DD MMMM YYYY',
                                          )}
                                        </Text>
                                        <Svg
                                          style={{left: 10}}
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="96"
                                          height="52"
                                          viewBox="0 0 96 52"
                                          fill="none">
                                          <G filter="url(#filter0_d_0_1)">
                                            <Rect
                                              x="15"
                                              y="11"
                                              width="66"
                                              height="22"
                                              rx="5"
                                              fill="white"
                                            />
                                            <Rect
                                              x="15.5"
                                              y="11.5"
                                              width="65"
                                              height="21"
                                              rx="4.5"
                                              stroke="#80884D"
                                            />
                                          </G>
                                          <Path
                                            d="M36.3824 25H37.5299L38.1695 23.0957H40.8648L41.4996 25H42.6519L40.108 17.9541H38.9264L36.3824 25ZM39.4732 19.1895H39.5562L40.5719 22.2168H38.4625L39.4732 19.1895ZM43.3963 25H44.4559V23.0713L44.91 22.6172L46.7361 25H48.0252L45.6668 21.9336L47.8787 19.6973H46.6385L44.534 21.9336H44.4559V17.6172H43.3963V25ZM50.5469 25.0342C50.752 25.0342 50.9473 25.0098 51.1182 24.9805V24.1357C50.9717 24.1504 50.8789 24.1553 50.7178 24.1553C50.1953 24.1553 49.9805 23.9209 49.9805 23.3496V20.5322H51.1182V19.6973H49.9805V18.3594H48.9014V19.6973H48.0713V20.5322H48.9014V23.6035C48.9014 24.624 49.3799 25.0342 50.5469 25.0342ZM52.4973 18.75C52.8586 18.75 53.1613 18.4521 53.1613 18.0908C53.1613 17.7246 52.8586 17.4268 52.4973 17.4268C52.1311 17.4268 51.8332 17.7246 51.8332 18.0908C51.8332 18.4521 52.1311 18.75 52.4973 18.75ZM51.965 25H53.0197V19.6973H51.965V25ZM55.6147 25H56.7426L58.6567 19.6973H57.5434L56.225 23.9258H56.142L54.8188 19.6973H53.6957L55.6147 25Z"
                                            fill="#80884D"
                                          />
                                        </Svg>
                                      </View>
                                      <View
                                        style={{
                                          alignItems: 'center',
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                          paddingHorizontal: 18,
                                        }}>
                                        <Svg
                                          width="52"
                                          height="12"
                                          viewBox="0 0 52 12"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg">
                                          <Path
                                            d="M0.410156 9H1.78711L2.55469 6.71484H5.78906L6.55078 9H7.93359L4.88086 0.544922H3.46289L0.410156 9ZM4.11914 2.02734H4.21875L5.4375 5.66016H2.90625L4.11914 2.02734ZM12.2307 9.10547C13.8361 9.10547 14.8674 7.82227 14.8674 5.82422V5.8125C14.8674 3.79688 13.8479 2.52539 12.2307 2.52539C11.3576 2.52539 10.6135 2.95898 10.2736 3.64453H10.1799V0.140625H8.90841V9H10.1799V7.99805H10.2736C10.6428 8.69531 11.34 9.10547 12.2307 9.10547ZM11.8733 8.02148C10.8127 8.02148 10.1565 7.18359 10.1565 5.82422V5.8125C10.1565 4.45312 10.8127 3.61523 11.8733 3.61523C12.9338 3.61523 13.5725 4.44727 13.5725 5.8125V5.82422C13.5725 7.18945 12.9338 8.02148 11.8733 8.02148ZM16.0356 9H17.307V5.26758C17.307 4.24219 17.8871 3.60352 18.8188 3.60352C19.7504 3.60352 20.1899 4.125 20.1899 5.17969V9H21.4555V4.88086C21.4555 3.36328 20.6703 2.51367 19.2465 2.51367C18.3207 2.51367 17.7113 2.92383 17.4008 3.60352H17.307V0.140625H16.0356V9ZM25.5182 9.12305C27.3815 9.12305 28.524 7.875 28.524 5.82422V5.8125C28.524 3.76172 27.3756 2.51367 25.5182 2.51367C23.6549 2.51367 22.5065 3.76758 22.5065 5.8125V5.82422C22.5065 7.875 23.649 9.12305 25.5182 9.12305ZM25.5182 8.0625C24.4225 8.0625 23.8073 7.23633 23.8073 5.82422V5.8125C23.8073 4.40039 24.4225 3.57422 25.5182 3.57422C26.608 3.57422 27.2291 4.40039 27.2291 5.8125V5.82422C27.2291 7.23047 26.608 8.0625 25.5182 8.0625ZM29.6922 9H30.9637V0.140625H29.6922V9ZM34.5694 9.12305C35.4952 9.12305 36.1397 8.72461 36.4444 8.03906H36.544V9H37.8096V2.63672H36.544V6.36914C36.544 7.39453 35.9991 8.0332 34.9795 8.0332C34.0479 8.0332 33.6612 7.51172 33.6612 6.45703V2.63672H32.3897V6.75586C32.3897 8.26172 33.1338 9.12305 34.5694 9.12305ZM39.2356 9H40.5071V5.26758C40.5071 4.24219 41.0872 3.60352 42.0188 3.60352C42.9504 3.60352 43.3899 4.125 43.3899 5.17969V9H44.6555V4.88086C44.6555 3.36328 43.8704 2.51367 42.4465 2.51367C41.5208 2.51367 40.9114 2.92383 40.6008 3.60352H40.5071V2.63672H39.2356V9ZM48.7124 11.2441C50.517 11.2441 51.6596 10.3184 51.6596 8.87109V2.63672H50.394V3.67969H50.3178C49.9487 2.96484 49.2573 2.52539 48.3667 2.52539C46.7143 2.52539 45.7006 3.80859 45.7006 5.625V5.63672C45.7006 7.42969 46.7085 8.68945 48.3432 8.68945C49.2163 8.68945 49.9194 8.30273 50.3061 7.61133H50.3999V8.86523C50.3999 9.73242 49.7788 10.2246 48.7299 10.2246C47.8686 10.2246 47.353 9.91406 47.2475 9.47461L47.2417 9.46289H45.9585L45.9467 9.47461C46.0991 10.5352 47.0952 11.2441 48.7124 11.2441ZM48.6948 7.64062C47.6108 7.64062 47.0014 6.81445 47.0014 5.63086V5.61914C47.0014 4.43555 47.6108 3.60352 48.6948 3.60352C49.767 3.60352 50.4233 4.43555 50.4233 5.61914V5.63086C50.4233 6.82031 49.7729 7.64062 48.6948 7.64062Z"
                                            fill="#B3B3B3"
                                          />
                                        </Svg>
                                        <Svg
                                          width="15"
                                          height="15"
                                          viewBox="0 0 15 15"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg">
                                          <Path
                                            d="M10.8 6.53123L13.125 4.20623M13.125 4.20623L10.8 1.88123M13.125 4.20623H1.875M4.2 8.46873L1.875 10.7937M1.875 10.7937L4.2 13.1187M1.875 10.7937H13.125"
                                            stroke="#B3B3B3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </Svg>
                                        <Svg
                                          width="50"
                                          height="13"
                                          viewBox="0 0 50 13"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg">
                                          <Path
                                            d="M0.0605469 10H5.33398V8.86914H1.37305V1.54492H0.0605469V10ZM7.10567 2.5C7.53927 2.5 7.90255 2.14258 7.90255 1.70898C7.90255 1.26953 7.53927 0.912109 7.10567 0.912109C6.66622 0.912109 6.3088 1.26953 6.3088 1.70898C6.3088 2.14258 6.66622 2.5 7.10567 2.5ZM6.467 10H7.73263V3.63672H6.467V10ZM11.8481 10.123C13.477 10.123 14.3559 9.18555 14.5668 8.34766L14.5785 8.29492L13.3539 8.30078L13.3305 8.34766C13.1781 8.67578 12.6918 9.08008 11.8774 9.08008C10.8285 9.08008 10.1606 8.37109 10.1371 7.15234H14.6488V6.70703C14.6488 4.79688 13.559 3.51367 11.7836 3.51367C10.0082 3.51367 8.85978 4.84375 8.85978 6.83008V6.83594C8.85978 8.85156 9.98478 10.123 11.8481 10.123ZM11.7895 4.55664C12.6508 4.55664 13.2895 5.10742 13.3891 6.24414H10.1547C10.266 5.14844 10.9223 4.55664 11.7895 4.55664ZM16.2037 10H17.4694V4.63867H18.8698V3.63672H17.4576V3.02734C17.4576 2.38281 17.733 2.04297 18.4362 2.04297C18.6354 2.04297 18.8053 2.05469 18.9225 2.07227V1.14062C18.7057 1.10547 18.4596 1.08203 18.1725 1.08203C16.8483 1.08203 16.2037 1.70312 16.2037 2.96875V3.63672H15.1549V4.63867H16.2037V10ZM22.3172 10.123C23.9461 10.123 24.825 9.18555 25.036 8.34766L25.0477 8.29492L23.8231 8.30078L23.7996 8.34766C23.6473 8.67578 23.161 9.08008 22.3465 9.08008C21.2977 9.08008 20.6297 8.37109 20.6063 7.15234H25.118V6.70703C25.118 4.79688 24.0282 3.51367 22.2528 3.51367C20.4774 3.51367 19.3289 4.84375 19.3289 6.83008V6.83594C19.3289 8.85156 20.4539 10.123 22.3172 10.123ZM22.2586 4.55664C23.12 4.55664 23.7586 5.10742 23.8582 6.24414H20.6239C20.7352 5.14844 21.3914 4.55664 22.2586 4.55664ZM26.2217 10H27.4932V6.19727C27.4932 5.27734 28.1553 4.67969 29.128 4.67969C29.3682 4.67969 29.585 4.70898 29.8135 4.75586V3.58398C29.6846 3.55469 29.462 3.52539 29.2569 3.52539C28.4073 3.52539 27.8155 3.92383 27.587 4.59766H27.4932V3.63672H26.2217V10ZM32.7395 10.123C33.6653 10.123 34.3098 9.72461 34.6145 9.03906H34.7141V10H35.9797V3.63672H34.7141V7.36914C34.7141 8.39453 34.1692 9.0332 33.1497 9.0332C32.218 9.0332 31.8313 8.51172 31.8313 7.45703V3.63672H30.5598V7.75586C30.5598 9.26172 31.304 10.123 32.7395 10.123ZM37.4057 10H38.6772V6.26758C38.6772 5.24219 39.2573 4.60352 40.1889 4.60352C41.1206 4.60352 41.56 5.125 41.56 6.17969V10H42.8256V5.88086C42.8256 4.36328 42.0405 3.51367 40.6167 3.51367C39.6909 3.51367 39.0815 3.92383 38.771 4.60352H38.6772V3.63672H37.4057V10ZM46.8825 12.2441C48.6872 12.2441 49.8298 11.3184 49.8298 9.87109V3.63672H48.5641V4.67969H48.488C48.1188 3.96484 47.4274 3.52539 46.5368 3.52539C44.8844 3.52539 43.8708 4.80859 43.8708 6.625V6.63672C43.8708 8.42969 44.8786 9.68945 46.5133 9.68945C47.3864 9.68945 48.0895 9.30273 48.4762 8.61133H48.57V9.86523C48.57 10.7324 47.9489 11.2246 46.9001 11.2246C46.0387 11.2246 45.5231 10.9141 45.4176 10.4746L45.4118 10.4629H44.1286L44.1169 10.4746C44.2692 11.5352 45.2653 12.2441 46.8825 12.2441ZM46.8649 8.64062C45.7809 8.64062 45.1715 7.81445 45.1715 6.63086V6.61914C45.1715 5.43555 45.7809 4.60352 46.8649 4.60352C47.9372 4.60352 48.5934 5.43555 48.5934 6.61914V6.63086C48.5934 7.82031 47.943 8.64062 46.8649 8.64062Z"
                                            fill="#B3B3B3"
                                          />
                                        </Svg>
                                      </View>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                        }}>
                                        <View
                                          style={{
                                            width: 124,
                                            height: 34,
                                            left: 17,
                                          }}>
                                          <Text
                                            style={{
                                              fontSize: 12,
                                              fontWeight: 'bold',
                                              textAlign: 'left',
                                            }}>
                                            {streets}
                                          </Text>
                                        </View>
                                        <View
                                          style={{
                                            width: 75,
                                            height: 34,
                                            right: 17,
                                          }}>
                                          <Text
                                            style={{
                                              fontSize: 12,
                                              fontWeight: 'bold',
                                              textAlign: 'right',
                                            }}>
                                            {street}
                                          </Text>
                                        </View>
                                      </View>
                                      <View
                                        style={{
                                          paddingHorizontal: 20,
                                          marginBottom: 20,
                                        }}>
                                        <View
                                          style={{
                                            borderWidth: 1,
                                            borderRadius: 10,
                                            borderColor: '#80884D',
                                          }}>
                                          <Text
                                            style={{
                                              color: '#80884D',
                                              textAlign: 'center',
                                            }}>
                                            {poruchenie}
                                          </Text>
                                        </View>
                                      </View>
                                      <View
                                        style={{
                                          alignItems: 'center',
                                          marginBottom: 20,
                                        }}>
                                        <Svg
                                          width="295"
                                          height="1"
                                          viewBox="0 0 295 1"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg">
                                          <Line
                                            y1="0.5"
                                            x2="295"
                                            y2="0.5"
                                            stroke="#80884D"
                                            strokeOpacity="0.6"
                                          />
                                        </Svg>
                                      </View>
                                      <View
                                        style={{
                                          alignItems: 'center',
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                          paddingHorizontal: 15,
                                          marginBottom: 20,
                                        }}>
                                        <Svg
                                          width="49"
                                          height="12"
                                          viewBox="0 0 49 12"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg">
                                          <Path
                                            d="M3.91992 9.20508C5.88867 9.20508 7.14844 8.19727 7.14844 6.58008V6.57422C7.14844 5.32031 6.42188 4.60547 4.64648 4.22461L3.72656 4.01953C2.63086 3.78516 2.18555 3.375 2.18555 2.74805V2.74219C2.18555 1.94531 2.91797 1.48242 3.9082 1.48242C4.93359 1.47656 5.5957 1.98047 5.70703 2.67188L5.71875 2.74805H6.99023L6.98438 2.66602C6.89062 1.35352 5.71875 0.339844 3.92578 0.339844C2.13281 0.339844 0.867188 1.34766 0.861328 2.80664V2.8125C0.861328 4.06055 1.59961 4.85742 3.31641 5.2207L4.24219 5.41992C5.36133 5.66016 5.81836 6.08203 5.81836 6.73242V6.73828C5.81836 7.52344 5.05078 8.0625 3.97266 8.0625C2.8418 8.0625 2.02734 7.57031 1.95703 6.80273L1.95117 6.73828H0.662109L0.667969 6.81445C0.785156 8.23828 2.00977 9.20508 3.91992 9.20508ZM10.9943 9.12305C12.6233 9.12305 13.5022 8.18555 13.7131 7.34766L13.7248 7.29492L12.5002 7.30078L12.4768 7.34766C12.3244 7.67578 11.8381 8.08008 11.0236 8.08008C9.97481 8.08008 9.30684 7.37109 9.28341 6.15234H13.7951V5.70703C13.7951 3.79688 12.7053 2.51367 10.9299 2.51367C9.1545 2.51367 8.00606 3.84375 8.00606 5.83008V5.83594C8.00606 7.85156 9.13106 9.12305 10.9943 9.12305ZM10.9358 3.55664C11.7971 3.55664 12.4358 4.10742 12.5354 5.24414H9.30098C9.41231 4.14844 10.0686 3.55664 10.9358 3.55664ZM14.8988 9H16.1703V5.26758C16.1703 4.24219 16.7504 3.60352 17.682 3.60352C18.6137 3.60352 19.0531 4.125 19.0531 5.17969V9H20.3188V4.88086C20.3188 3.36328 19.5336 2.51367 18.1098 2.51367C17.184 2.51367 16.5746 2.92383 16.2641 3.60352H16.1703V2.63672H14.8988V9ZM24.0065 9.10547C24.8971 9.10547 25.5944 8.69531 25.9635 7.99805H26.0631V9H27.3287V0.140625H26.0631V3.64453H25.9635C25.6237 2.95898 24.8795 2.52539 24.0065 2.52539C22.3893 2.52539 21.3698 3.79688 21.3698 5.8125V5.82422C21.3698 7.82227 22.4069 9.10547 24.0065 9.10547ZM24.3698 8.02148C23.3033 8.02148 22.6647 7.18945 22.6647 5.82422V5.8125C22.6647 4.44727 23.3033 3.61523 24.3698 3.61523C25.4244 3.61523 26.0807 4.45312 26.0807 5.8125V5.82422C26.0807 7.18359 25.4303 8.02148 24.3698 8.02148ZM30.9344 9.12305C31.8602 9.12305 32.5047 8.72461 32.8094 8.03906H32.909V9H34.1746V2.63672H32.909V6.36914C32.909 7.39453 32.3641 8.0332 31.3446 8.0332C30.4129 8.0332 30.0262 7.51172 30.0262 6.45703V2.63672H28.7547V6.75586C28.7547 8.26172 29.4989 9.12305 30.9344 9.12305ZM35.6006 9H36.8721V5.26758C36.8721 4.24219 37.4522 3.60352 38.3838 3.60352C39.3155 3.60352 39.7549 4.125 39.7549 5.17969V9H41.0205V4.88086C41.0205 3.36328 40.2354 2.51367 38.8116 2.51367C37.8858 2.51367 37.2764 2.92383 36.9659 3.60352H36.8721V2.63672H35.6006V9ZM45.0774 11.2441C46.8821 11.2441 48.0247 10.3184 48.0247 8.87109V2.63672H46.759V3.67969H46.6829C46.3137 2.96484 45.6223 2.52539 44.7317 2.52539C43.0793 2.52539 42.0657 3.80859 42.0657 5.625V5.63672C42.0657 7.42969 43.0735 8.68945 44.7083 8.68945C45.5813 8.68945 46.2844 8.30273 46.6711 7.61133H46.7649V8.86523C46.7649 9.73242 46.1438 10.2246 45.095 10.2246C44.2336 10.2246 43.718 9.91406 43.6125 9.47461L43.6067 9.46289H42.3235L42.3118 9.47461C42.4641 10.5352 43.4602 11.2441 45.0774 11.2441ZM45.0598 7.64062C43.9758 7.64062 43.3665 6.81445 43.3665 5.63086V5.61914C43.3665 4.43555 43.9758 3.60352 45.0598 3.60352C46.1321 3.60352 46.7883 4.43555 46.7883 5.61914V5.63086C46.7883 6.82031 46.1379 7.64062 45.0598 7.64062Z"
                                            fill="#B3B3B3"
                                          />
                                        </Svg>
                                        <Text>{ves} kg</Text>
                                      </View>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          paddingHorizontal: 15,
                                          marginBottom: 15,
                                        }}>
                                        <View>
                                          <Text>{namesgruz}</Text>
                                        </View>
                                        <View>
                                          <Text>
                                            {formatter
                                              .format(summ || 0)
                                              .replace('₽', '€')}
                                          </Text>
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                ) : (
                                  <></>
                                )}
                              </>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    ),
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
export default ZakazScreen;
