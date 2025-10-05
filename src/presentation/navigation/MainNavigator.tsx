import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ProductListScreen } from '../screens/Products/ProductListScreen';
import { ProductDetailsScreen } from '../screens/Products/ProductDetailsScreen';

// Wrapper para ProductDetailsScreen
const ProductDetailsWrapper = (props: any) => <ProductDetailsScreen {...props} />;
import { FavoritesScreen } from '../screens/Favorites/FavoritesScreen';
import { ProfileScreen } from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ProductStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ProductList" component={ProductListScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsWrapper} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const FavoritesStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="FavoritesList" component={FavoritesScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsWrapper} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 70,
        borderTopWidth: 2,
        borderTopColor: '#E5E5E7',
        paddingHorizontal: 12,
        paddingTop: -1,
        paddingBottom: 5,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
      }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;

        let iconName = 'ellipse';
        if (route.name === 'ProductsTab') iconName = focused ? 'home' : 'home-outline';
        if (route.name === 'Favorites') iconName = focused ? 'heart' : 'heart-outline';
        if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -2 }}
            activeOpacity={0.9}
          >
            <View
              style={{
                backgroundColor: focused ? 'transparent' : 'transparent',
                borderTopWidth: focused ? 2 : 0,
                borderTopColor: '#7A2EFF',
                paddingHorizontal: 18,
                paddingTop: 12,
                paddingBottom: 8,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {focused && (
                <LinearGradient
                  colors={['#F0E8FF', '#FFFFFF']}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
              )}
              <Ionicons name={iconName as any} size={20} color={focused ? '#7A2EFF' : '#8E8E93'} />
              <Text style={{ fontSize: 12, marginTop: 4, color: focused ? '#7A2EFF' : '#8E8E93', fontWeight: '500' }}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="ProductsTab" component={ProductStack} options={{ title: 'Home' }} />
      <Tab.Screen name="Favorites" component={FavoritesStack} options={{ title: 'Favoritos' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
};
