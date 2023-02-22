import React from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {colors} from '../../styles';

const TextInputWithLable = ({
  label,
  value,
  placheHolder,
  isSecure,
  onChangeText,
  secureTextEntry,
  onBlur,
  ...props
}) => {
  return (
    <View style={styles.auth}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        secureTextEntry={true}
        value={value}
        onBlur={onBlur}
        placeholder={placheHolder}
        onChangeText={onChangeText}
        style={styles.inputStyle}
        placeholderTextColor={colors.placeholder}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    borderWidth: 3,
    borderColor: colors.placeholder,
    borderRadius: 10,
    color: colors.placeholder,
    minWidth: '100%',
  },
  auth: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.placeholder,
    fontWeight: 'bold',
  },
});

export default TextInputWithLable;
