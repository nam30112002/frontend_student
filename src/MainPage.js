import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library
import ClassManagement from './ClassManagement';
import HomePage from './HomePage';
import ClassDetail from './ClassDetail';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeScreen = () => {
  return <HomePage />;
};

const ClassManagementStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ClassManagement" component={ClassManagement} options={{ headerShown: false }} />
      <Stack.Screen name="ClassDetail" component={ClassDetail} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default function MainPage() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Class management') {
            iconName = focused ? 'book' : 'book';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Điểm danh" component={HomeScreen} />
      <Tab.Screen name="Lớp học của tôi" component={ClassManagementStack} />
    </Tab.Navigator>
  );
}