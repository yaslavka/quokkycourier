import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Svg, {Path, Rect} from 'react-native-svg';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import avatar from '../../assets/images/icons/camera_200.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

function HomeHeader() {
  const userInfo = useSelector(state => state.app.user);
  const navigation = useNavigation();
  const [state, setState] = useState();

  return (
    <View style={[styles.header]}>
      {userInfo && (
        <>
          <View
            style={[
              styles.headercontent,
              {alignItems: 'center', justifyContent: 'space-between'},
            ]}>
            <TouchableOpacity
              style={{marginLeft: 15}}
              onPress={() => {
                navigation.toggleDrawer();
              }}>
              <Svg
                width="22"
                height="18"
                viewBox="0 0 22 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <Rect width="22" height="2" rx="1" fill="#80884D" />
                <Rect
                  y="7.70001"
                  width="13.2"
                  height="2"
                  rx="1"
                  fill="#80884D"
                />
                <Rect y="15.4" width="22" height="2" rx="1" fill="#80884D" />
              </Svg>
            </TouchableOpacity>
            <View style={{alignItems: 'center'}}>
              <Text style={[styles.text, {paddingRight: wp(30)}]}>
                Neue Bestellung
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    height: hp(12),
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
