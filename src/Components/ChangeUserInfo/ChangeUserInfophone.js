import React, {useCallback, useMemo} from 'react';
import {Formik} from 'formik';
import {useSelector, useDispatch} from 'react-redux';

import * as actions from '../../actions/app.actions';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import TextInputWithLable from '../../Components/TextInputWithLable';
import {colors} from '../../styles';

function ChangeUserInfoPhone() {
  const dispatch = useDispatch();
  const profile = useSelector(state => state.app.user);
  const isLoading = useSelector(state => state.app.loadings.changeSocial);

  const initialValues = useMemo(() => {
    let values = {phone: '', email: ''};
    if (profile) {
      const {myInstagram, myTg} = profile;
      values = {
        ...values,
        phone: myInstagram || '',
        email: myTg || '',
      };
    }

    return values;
  }, [profile]);

  const handleOnSubmit = useCallback(
    values => {
      dispatch(actions.changeSocial(values));
    },
    [dispatch],
  );

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleOnSubmit}
      enableReinitialize>
      {({isValid, dirty, handleSubmit, handleChange, handleBlur, values}) => (
        <View style={styles.card}>
          <View style={styles.card__body}>
            <TextInputWithLable
              onChangeText={handleChange('phone')}
              onBlur={handleBlur('phone')}
              value={values.firstName}
              placheHolder="phone"
            />
            <TextInputWithLable
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placheHolder="email"
            />
            <TouchableOpacity
              style={styles.w1001}
              onPress={handleSubmit}
              disabled={!(isValid && dirty) || isLoading}
              loading={isLoading}
              block>
              <Text style={styles.text}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Formik>
  );
}
const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 10,
  },
  card__header: {},
  card__headerle: {},
  card__title: {},
  card__body: {
    paddingHorizontal: 10,
    paddingTop: 30,
    paddingBottom: 30,
    marginTop: 30,
    backgroundColor: 'rgba(0,0,0,.24)',
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: colors.placeholder,
    borderRadius: 15,
  },
  w1001: {
    height: 40,
    fontWeight: '500',
    fontSize: 14,
    backgroundColor: '#46551fb0',
    textTransform: 'uppercase',
    width: 300,
    marginTop: 4,
    marginRight: 'auto',
    marginBottom: 4,
    marginLeft: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderStyle: 'solid',
    borderColor: colors.placeholder,
  },
  text: {
    color: colors.placeholder,
    fontSize: 20,
    fontWeight: '500',
  },
});
export default ChangeUserInfoPhone;
