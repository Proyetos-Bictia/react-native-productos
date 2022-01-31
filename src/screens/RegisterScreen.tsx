import React, { useContext, useEffect, useRef } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { loginStyles } from '../theme/loginTheme';

import WhiteLogo from '../components/WhiteLogo';
import { useForm } from '../hooks/useForm';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<any, any> { }

const RegisterScreen = ({ navigation }: Props) => {

  const { errorMessage, singUp, removeError } = useContext(AuthContext);
  const ref_input2 = useRef<TextInput>();
  const ref_input3 = useRef<TextInput>();

  useEffect(() => {
    if(errorMessage.length === 0) return;
    Alert.alert('Register', errorMessage,[
      {
        text: 'Ok',
        onPress: removeError
      }
    ])
  }, [errorMessage]);
  

  const { email, password, name, onChange } = useForm({
    name: '',
    email: '',
    password: ''
  });

  const onRegister = () => {
    Keyboard.dismiss();
    singUp({ correo: email, password, nombre: name });
  }

  return (
    <>

      <KeyboardAvoidingView
        style={{
          flex: 1,
          backgroundColor: '#5856D6'
        }}
        behavior={(Platform.OS === 'ios') ? 'padding' : 'height'}
      >
        <View style={loginStyles.formContainer}>
          <WhiteLogo />

          <Text style={loginStyles.title}>Registro</Text>

          <Text style={loginStyles.label}>Nombre:</Text>
          <TextInput
            placeholder='Ingrese su nombre'
            placeholderTextColor='rgba(255,255,255,0.4)'
            underlineColorAndroid='white'
            style={[
              loginStyles.inputField,
              (Platform.OS === 'ios') && loginStyles.inputFieldIOS
            ]}
            selectionColor='white'
            onChangeText={(value) => onChange(value, 'name')}
            value={name}
            onSubmitEditing={() => ref_input2.current?.focus()}
            autoCapitalize='words'
            autoCorrect={false}
          />

          <Text style={loginStyles.label}>Email:</Text>
          <TextInput
            placeholder='Ingrese su nombre'
            placeholderTextColor='rgba(255,255,255,0.4)'
            underlineColorAndroid='white'
            style={[
              loginStyles.inputField,
              (Platform.OS === 'ios') && loginStyles.inputFieldIOS
            ]}
            selectionColor='white'
            onChangeText={(value) => onChange(value, 'email')}
            value={email}
            onSubmitEditing={() => ref_input3.current?.focus()}
            autoCapitalize='none'
            autoCorrect={false}
            ref={ref_input2 as any}
          />

          <Text style={loginStyles.label}>Password:</Text>
          <TextInput
            placeholder='********'
            placeholderTextColor='rgba(255,255,255,0.4)'
            underlineColorAndroid='white'
            secureTextEntry
            style={[
              loginStyles.inputField,
              (Platform.OS === 'ios') && loginStyles.inputFieldIOS
            ]}
            onChangeText={(value) => onChange(value, 'password')}
            value={password}
            onSubmitEditing={onRegister}
            autoCorrect={false}
            ref={ref_input3 as any}
          />

          <View style={loginStyles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={loginStyles.button}
              onPress={onRegister}
            >
              <Text style={loginStyles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.replace('LoginScreen')}
            style={loginStyles.buttonReturn}
          >
            <Text style={loginStyles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

    </>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
