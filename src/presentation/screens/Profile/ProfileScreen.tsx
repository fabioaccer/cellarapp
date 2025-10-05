import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../presentation/hooks/useAuth';
import { useNotifications } from '../../../presentation/hooks/useNotifications';
import { AuthGuard } from '../../../presentation/components/AuthGuard';
import { formatDate } from '../../../utils/formatters/dateFormatter';
import Ionicons from '@expo/vector-icons/Ionicons';

export const ProfileScreen: React.FC = () => {
    const { user, logout } = useAuth();
    const { token, hasPermission } = useNotifications();

    const handleLogout = () => {
        Alert.alert(
            'Sair',
            'Tem certeza que deseja sair?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout();
                        } catch (error) {
                            Alert.alert('Erro', 'Falha ao fazer logout');
                        }
                    },
                },
            ]
        );
    };

    const renderProfileContent = () => {
        if (!user) {
            return null;
        }

        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Perfil</Text>
                </View>
                
                <ScrollView style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.avatarContainer}>
                            <Ionicons name="person" size={60} color="#7A2EFF" />
                        </View>
                        <Text style={styles.name}>{user.displayName || 'Usuário'}</Text>
                        <Text style={styles.email}>{user.email}</Text>
                    </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informações da Conta</Text>

                    <View style={styles.infoItem}>
                        <Ionicons name="calendar-outline" size={20} color="#666" />
                        <View style={styles.infoText}>
                            <Text style={styles.infoLabel}>Membro desde</Text>
                            <Text style={styles.infoValue}>{formatDate(user.createdAt)}</Text>
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <Ionicons name="mail-outline" size={20} color="#666" />
                        <View style={styles.infoText}>
                            <Text style={styles.infoLabel}>Email</Text>
                            <Text style={styles.infoValue}>{user.email}</Text>
                        </View>
                    </View>

                    <View style={styles.infoItem}>
                        <Ionicons
                            name={hasPermission ? "notifications" : "notifications-off"}
                            size={20}
                            color="#666"
                        />
                        <View style={styles.infoText}>
                            <Text style={styles.infoLabel}>Notificações</Text>
                            <Text style={styles.infoValue}>
                                {hasPermission ? 'Ativadas' : 'Desativadas'}
                            </Text>
                        </View>
                    </View>
                </View>

                {__DEV__ && token && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Desenvolvedor</Text>
                        <View style={styles.debugInfo}>
                            <Text style={styles.debugLabel}>FCM Token:</Text>
                            <Text style={styles.debugValue} numberOfLines={2}>
                                {token}
                            </Text>
                        </View>
                    </View>
                )}

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                    <Text style={styles.logoutText}>Sair da Conta</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Versão 1.0.0</Text>
                </ScrollView>
            </SafeAreaView>
        );
    };

    return (
        <AuthGuard>
            {renderProfileContent()}
        </AuthGuard>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#48109C',
    },
    headerContainer: {
        backgroundColor: '#48109C',
        paddingVertical: 16,
        elevation: 0,
        shadowOpacity: 0,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        backgroundColor: '#FFF',
        alignItems: 'center',
        padding: 24,
        marginBottom: 16,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F0E8FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    section: {
        backgroundColor: '#FFF',
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    infoText: {
        marginLeft: 12,
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },
    debugInfo: {
        padding: 12,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
    },
    debugLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    debugValue: {
        fontSize: 10,
        color: '#666',
        fontFamily: 'monospace',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF3B30',
        marginLeft: 8,
    },
    version: {
        textAlign: 'center',
        fontSize: 12,
        color: '#999',
        marginVertical: 24,
    },
});