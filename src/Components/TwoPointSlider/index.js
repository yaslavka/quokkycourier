import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
const {width} = Dimensions.get('window');

function TwoPointSlider({values, min, max, prefix, postfix, onValuesChange}) {
  return (
    <MultiSlider
      values={values}
      sliderLength={width - 24 * 2 - 20}
      min={min}
      max={max}
      step={1}
      markerOffsetY={20}
      selectedStyle={{
        backgroundColor: '#bdc87c',
      }}
      trackStyle={{
        height: 10,
        borderRadius: 10,
        backgroundColor: '#F5F5F8',
      }}
      minMarkerOverlapDistance={50}
      customMarker={e => {
        return (
          <View
            style={{
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                borderWidth: 4,
                borderColor: '#FFFFFF',
                backgroundColor: '#bdc87c',
                ...styles.shadow,
              }}
            />
            <Text
              style={{
                marginTop: 5,
                color: '#0c0c0c',
                lineHeight: 22,
                fontSize: 16,
              }}>
              {prefix}
              {e.currentValue} {postfix}
            </Text>
          </View>
        );
      }}
      onValuesChange={values => onValuesChange(values)}
    />
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 1,
    shadowOpacity: 0.1,
  },
});

export default TwoPointSlider;
