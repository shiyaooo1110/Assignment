import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import MenuScreen from "../screens/MenuScreen";
import SearchScreen from "../screens/SeacrhScreen";
import OrderScreen from "../screens/OrderScreen";
import { Dimensions } from 'react-native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';

const Bottom = createBottomTabNavigator();

const BottomTabNavigation = () => {

  const windowHeight = Dimensions.get('window').height;

  // Accessing the route params (user_id and user_name) from the previous screen
  const route = useRoute();
  const { user_id }: any = route.params;
  const { user_name }: any = route.params;

  console.log('Received:', user_name);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Bottom.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            height: windowHeight * .08,
            position: 'absolute',
            backgroundColor: 'white',
          },
        }}
      >
        {/* Register screens */}
        <Bottom.Screen
          name='home'
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons name='greenhouse' size={40} color={focused ? '#7a5835' : 'grey'} />
            ),
          }}
        />
        <Bottom.Screen
          name='menu'
          component={MenuScreen}
          initialParams={{ user_id, user_name }}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons name='beer' size={40} color={focused ? '#7a5835' : 'grey'} />
            )
          }}
        />
        <Bottom.Screen
          name='Search'
          component={SearchScreen}
          initialParams={{ user_id }}
          options={{
            headerTitle: 'Search',
            tabBarIcon: ({ focused }) => (
              <Ionicons name='search' size={40} color={focused ? '#7a5835' : 'grey'} />
            )
          }}
        />
        <Bottom.Screen
          name='Order'
          component={OrderScreen}
          initialParams={{ user_id, user_name }}
          options={{
            title: 'Order',
            tabBarIcon: ({ focused }) => (
              <Ionicons name='receipt-outline' size={40} color={focused ? '#7a5835' : 'grey'} />
            )
          }}
        />
      </Bottom.Navigator>
    </GestureHandlerRootView>

  )
}

export default BottomTabNavigation;
