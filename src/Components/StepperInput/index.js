import React from 'react';
import {View, Text} from 'react-native';
import IconButton from '../IconButton';
import minus from '../../assets/minus.png';
import plus from '../../assets/plus.png';

const StepperInput = ({containerStyle, value = 1, onAdd, onMinus}) => {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
      <View />
      <View
        style={{
          flexDirection: 'row',
          height: 60,
          alignItems: 'flex-end',
          width: 130,
          backgroundColor: '#F5F5F8',
          borderRadius: 12,
          ...containerStyle,
        }}>
        <IconButton
          containerStyle={{
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          icon={minus}
          iconStyle={{
            height: 25,
            width: 25,
            tintColor: value > 1 ? '#FF6C44' : '#898B9A',
          }}
          onPress={onMinus}
        />

        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{lineHeight: 30, fontSize: 22, fontWeight: 'bold'}}>
            {value}
          </Text>
        </View>

        <IconButton
          containerStyle={{
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          icon={plus}
          iconStyle={{
            height: 25,
            width: 25,
            tintColor: '#FF6C44',
          }}
          onPress={onAdd}
        />
      </View>
    </View>
  );
};

export default StepperInput;
