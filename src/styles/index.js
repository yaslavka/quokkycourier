import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const colors = {
  input: 'rgb(7,7,7)',
  border: 'rgb(70,85,31)',
  button: 'rgb(70,85,31)',
  placeholder: 'rgba(128, 136, 77, 1)',
  cardComments: 'rgb(70,85,31)',
  cardBackab: 'rgb(70,85,31)',
  menu: '#fff',
  delay: '#bbe5af',
  buttons: '#ff8c52',
  grey: '#bebebe',
  grey1: '#43484d',
  grey2: '#5e6977',
  grey3: '#86939e',
  grey4: '#bdc6cf',
  grey5: '#e1e8ee',
  grey6: '#a0a0a0',
  grey7: '#F2f9f9',
  grey10: '#d6d6d6',
  CardComment: '#86939e',
  cardbackground: 'white',
  statusbar: '#ff8c52',
  heaherText: 'white',
  lightgreen: '#66DF48',
  blue: '#286ef0',
  black: '#000000',
  white: '#ffffff',
  darkBlue: '#2d328a',
  pagebackground: 'white',
  width,
  height,
};
export const rideData = [
  {street: '32 Olivia Rd', area: 'Klipfontein 83-Ir,Boksburg', id: '0'},
  {street: 'Hughes Industrial Park', area: 'Hughes,Boksburg', id: '1'},
  {
    street: '32 Olivia Road',
    area: ' East Rand,Ekurhuleni,Gauteng,1459',
    id: '2',
  },
  {street: 'Total Boksburg', area: '35 Atlas Rd,Anderbolt,Boksburg', id: '3'},
  {street: '179 8th Ave', area: 'Bezuidenhout Valley,Johannesburg', id: '4'},
];

export const filterData = [
  {name: 'Ride', image: require('../assets/ride.png'), id: '0'},
  {name: 'Food', image: require('../assets/food.png'), id: '1'},
  {name: 'Package', image: require('../assets/package.png'), id: '2'},
  {name: 'Reserve', image: require('../assets/reserve.png'), id: '3'},
];

export const COLORS = {
  // base colors
  primary: '#FC6D3F', // orange
  secondary: '#CDCDD2', // gray

  // colors
  black: '#1E1F20',
  white: '#FFFFFF',

  lightGray: '#F5F5F6',
  lightGray2: '#F6F6F7',
  lightGray3: '#EFEFF1',
  lightGray4: '#F8F8F9',
  transparent: 'transparent',
  darkgray: '#898C95',
};
export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 30,
  padding: 10,
  padding2: 12,

  // font sizes
  largeTitle: 50,
  h1: 30,
  h2: 22,
  h3: 20,
  h4: 18,
  body1: 30,
  body2: 20,
  body3: 16,
  body4: 14,
  body5: 12,

  // app dimensions
};
export const carsAround = [
  {latitude: -26.207487, longitude: 28.236226},
  {latitude: -26.202616, longitude: 28.227718},
  {latitude: -26.202424, longitude: 28.236612},
  {latitude: -26.208565, longitude: 28.237191},
  {latitude: -26.203598, longitude: 28.239509},
];
export const parameters = {
  statusBarHeight: getStatusBarHeight(),
  headerHeight: 70,

  styledButton: {
    backgroundColor: '#ff8c52',
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff8c52',
    height: 50,
    paddingHorizontal: 20,
    width: '100%',
  },

  buttonTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -3,
  },
};

export const title = {
  color: '#ff8c52',
  fontSize: 20,
  fontWeight: 'bold',
};
