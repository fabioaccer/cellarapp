import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
    children, 
    fallback 
}) => {
    const { user } = useAuth();

    if (user) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Ionicons name="lock-closed" size={64} color="#8E8E93" />
                <Text style={styles.title}>Login Necessário</Text>
                <Text style={styles.subtitle}>
                    Faça login para acessar esta funcionalidade
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        alignItems: 'center',
        maxWidth: 300,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#1C1C1E',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
});
