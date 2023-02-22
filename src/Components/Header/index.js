import React from 'react';
import SwitchSelector from 'react-native-switch-selector';
import {useTranslation} from 'react-i18next';
import {colors} from '../../styles';

function Header() {
  const {i18n} = useTranslation('common');
  const options = [
    {label: 'EN', value: 'en'},
    {label: 'DE', value: 'de'},
  ];
  return (
    <>
      <SwitchSelector buttonColor={colors.placeholder} textColor={colors.input}
        options={options}
        initial={0}
        onPress={value => {
          i18n.changeLanguage(value).then(() => {});
        }}
      />
    </>
  );
}
export default Header;
