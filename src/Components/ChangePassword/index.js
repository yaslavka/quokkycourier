import React, {useCallback} from 'react';
import {Formik} from 'formik';
import {useSelector, useDispatch} from 'react-redux';
import omit from 'lodash-es/omit';
import * as yup from 'yup';

import * as actions from '../../actions/app.actions';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import TextInputWithLable from '../TextInputWithLable';
import {colors} from '../../styles';

const initialValues = {
  old_password: '',
  new_password: '',
  repeat_new_password: '',
};

const validationSchema = yup.object({
  old_password: yup
    .string()
    .required('Необходимо заполнить это поле')
    .min(6, 'Пароль должен быть не менее 6 символов'),
  new_password: yup
    .string()
    .required('Необходимо заполнить это поле')
    .min(6, 'Пароль должен быть не менее 6 символов'),
  repeat_new_password: yup
    .string()
    .required('Необходимо заполнить это поле')
    .oneOf([yup.ref('new_password'), null], 'Пароли не совпадают'),
});

function ChangePassword() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.app.loadings.changePassword);

  const handleOnSubmit = useCallback(
    (values, formicActions) => {
      const callback = () => formicActions.resetForm();
      const newValues = omit(values, 'repeat_new_password');
      dispatch(actions.changePassword(newValues, callback));
    },
    [dispatch],
  );
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleOnSubmit}
      enableReinitialize>
      {({isValid, dirty, handleSubmit, handleChange, handleBlur, values}) => (
        <View style={styles.card}>
          <View style={styles.card__body}>
            <TextInputWithLable
              onChangeText={handleChange('old_password')}
              onBlur={handleBlur('old_password')}
              value={values.old_password}
              placheHolder="Текущий пароль"
            />
            <TextInputWithLable
              onChangeText={handleChange('new_password')}
              onBlur={handleBlur('new_password')}
              value={values.new_password}
              placheHolder="Новый пароль"
            />
            <TextInputWithLable
              onChangeText={handleChange('repeat_new_password')}
              onBlur={handleBlur('repeat_new_password')}
              value={values.repeat_new_password}
              placheHolder="Повторите новый пароль"
            />
            <TouchableOpacity
              style={styles.w1001}
              onPress={handleSubmit}
              disabled={!(isValid && dirty) || isLoading}
              loading={isLoading}
              block>
              <Text style={styles.text}>Подтвердить</Text>
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
export default ChangePassword;
