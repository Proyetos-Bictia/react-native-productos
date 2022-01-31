import React, { createContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { authReducer, AuthState } from './AuthReducer';
import { LoginData, LoginResponse, RegisterData, Usuario } from '../interfaces/appInterfaces.interface';
import cafeApi from '../api/cafeApi';

type AuthContextProps = {
  errorMessage: string;
  token: string | null;
  user: Usuario | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  singUp: ({ }: RegisterData) => void;
  singIn: ({ }: LoginData) => void;
  logOut: () => void;
  removeError: () => void;
}

const authInitialState: AuthState = {
  status: 'checking',
  errorMessage: '',
  token: null,
  user: null
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return dispatch({ type: 'notAuthenticated' });

      const { data } = await cafeApi.get<LoginResponse>('/auth');
      dispatch({
        type: 'signUp',
        payload: {
          token: data.token,
          user: data.usuario
        }
      });
      await AsyncStorage.setItem('token', data.token);
    } catch (error) {
      dispatch({
        type: 'notAuthenticated'
      })
    }
  }

  const singIn = async ({ correo, password }: LoginData) => {
    try {
      const { data } = await cafeApi.post<LoginResponse>('/auth/login', { correo, password });
      dispatch({
        type: 'signUp',
        payload: {
          token: data.token,
          user: data.usuario
        }
      });

      await AsyncStorage.setItem('token', data.token);
    } catch (error: any) {
      dispatch({
        type: 'addError',
        payload: error.response.data.msg || 'Info incorrected'
      })
      console.log(error.response.data.msg);
    }
  };
  const singUp = async ({ correo, password, nombre }: RegisterData) => {
    try {
      const { data } = await cafeApi.post<LoginResponse>('/usuarios', { correo, password, nombre });
      dispatch({
        type: 'signUp',
        payload: {
          token: data.token,
          user: data.usuario
        }
      });
      await AsyncStorage.setItem('token', data.token);
    } catch (error: any) {
      dispatch({
        type: 'addError',
        payload: error.response.data.errors[0].msg || 'Ocurrio un error'
      });
      console.log(error.response.data);
    }
  };
  const logOut = async () => {
    await AsyncStorage.clear();
    dispatch({ type: 'logout' });
  };
  const removeError = () => {
    dispatch({ type: 'removeError' })
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        singUp,
        singIn,
        logOut,
        removeError
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
