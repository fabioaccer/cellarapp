import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import { MainNavigator } from './MainNavigator';
import { AuthNavigator } from './AuthNavigator';
import { RootStackParamList } from './types';
import { useAuth } from '../hooks/useAuth';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
                <ActivityIndicator size="large" color="#7A2EFF" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <Stack.Screen name="MainStack" component={MainNavigator} />
                ) : (
                    <Stack.Screen 
                        name="AuthStack" 
                        component={AuthNavigator}
                        options={{
                            animation: 'slide_from_right'
                        }}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};