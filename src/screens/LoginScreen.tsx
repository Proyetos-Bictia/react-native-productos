import { Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useRef, useEffect} from 'react';
import Background from '../components/Background';
import WhiteLogo from '../components/WhiteLogo';
import { loginStyles } from '../theme/loginTheme';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useForm } from '../hooks/useForm';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<any, any> { }

const LoginScreen = ({ navigation }: Props) => {

  const { errorMessage, singIn, removeError } = useContext(AuthContext);
  const ref_input2 = useRef<TextInput>();

  useEffect(() => {
    if(errorMessage.length === 0) return;
    Alert.alert(
      'Login incorrecto',
      errorMessage,
      [
        {
          text: 'Ok',
          onPress: removeError
        }
      ]
    );
  }, [errorMessage]);

  const { email, password, onChange } = useForm({
    email: '',
    password: ''
  });

  const onLogin = () => {
    Keyboard.dismiss();
    singIn({ correo: email, password });
  }

  return (
    <>
      <Background />

      <KeyboardAvoidingView
        style={{
          flex: 1
        }}
        behavior={(Platform.OS === 'ios') ? 'padding' : 'height'}
      >
        <View style={loginStyles.formContainer}>
          <WhiteLogo />

          <Text style={loginStyles.title}>Login</Text>

          <Text style={loginStyles.label}>Email:</Text>
          <TextInput
            placeholder='example@gmail.com'
            placeholderTextColor='rgba(255,255,255,0.4)'
            keyboardType='email-address'
            underlineColorAndroid='white'
            style={[
              loginStyles.inputField,
              (Platform.OS === 'ios') && loginStyles.inputFieldIOS
            ]}
            selectionColor='white'
            onChangeText={(value) => onChange(value, 'email')}
            value={email}
            onSubmitEditing={() => ref_input2.current?.focus()}
            autoCapitalize='none'
            autoCorrect={false}
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
            onSubmitEditing={onLogin}
            autoCorrect={false}
            ref={ref_input2 as any}
          />

          <View style={loginStyles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={loginStyles.button}
              onPress={onLogin}
            >
              <Text style={loginStyles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={loginStyles.newUserContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.replace('RegisterScreen')}
            >
              <Text style={loginStyles.buttonText}>Nueva cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
