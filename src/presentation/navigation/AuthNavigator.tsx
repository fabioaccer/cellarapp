import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { RegisterScreen } from '../../presentation/screens/Auth/RegisterScreen';
import { ForgotPasswordScreen } from '../../presentation/screens/Auth/ForgotPasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
        headerStyle: {
          backgroundColor: '#48109C',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          title: 'Login',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{
          title: 'Criar Conta',
        }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{
          title: 'Recuperar Senha',
        }}
      />
    </Stack.Navigator>
  );
};