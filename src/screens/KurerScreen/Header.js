import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

function HomeHeader() {
  const navigation = useNavigation();

  return (
    <View style={[styles.header]}>
      <View
        style={[
          styles.headercontent,
          {alignItems: 'center', justifyContent: 'space-between'},
        ]}>
        <TouchableOpacity
          style={{marginLeft: 30}}
          onPress={() => {
            navigation.goBack();
          }}>
          <Svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <Path
              d="M9.57 5.92999L3.5 12L9.57 18.07M20.5 12H3.67"
              stroke="black"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text
          style={[
            styles.text,
            {textAlign: 'center', justifyContent: 'center'},
          ]}>
            Verifizierung
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    height: hp(8),
  },
  headercontent: {
    flexDirection: 'row',
    top: wp(5),
  },
  text: {
    color: '#000000',
    fontSize: wp(5),
    fontWeight: '900',
  },
  text2: {
    color: '#80884D',
    fontSize: 14,
    top: wp(0.5),
  },
});
export default HomeHeader;
