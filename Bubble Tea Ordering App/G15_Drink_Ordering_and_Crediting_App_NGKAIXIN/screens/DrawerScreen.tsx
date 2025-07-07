import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert } from "react-native";
import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import BottomTabNavigation from "../screens/BottomTabNavigation";
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from "../Types";
import ProfileScreen from "./ProfileScreen";

export type Props = StackScreenProps<RootStackParamList, 'Drawer'>;

const Drawer = createDrawerNavigator();

const DrawerScreen = ({ navigation, route }: Props) => {

  const { user_id, user_name } = route.params;

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerComponent {...props} user_name={user_name} />}
      screenOptions={{
        drawerActiveTintColor: 'black',
        drawerActiveBackgroundColor: '#e8d9ca',
        headerRight: () => (
          <Ionicons
            name="cart-outline"
            size={28}
            color='black'
            style={{ marginRight: 15 }}
            onPress={() => {
              navigation.navigate('Cart', { user_id: user_id });
            }}
          />
        ),
      }}
    >
      {/* Home Screen with Bottom Tab Navigation */}
      <Drawer.Screen
        name="Home"
        component={BottomTabNavigation}
        initialParams={{ user_id, user_name }}
        options={{
          headerTitle: 'Bubble Tea Shop',
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcon name='greenhouse' size={30} color={color} />
          ),
          drawerLabelStyle: {
            fontSize: 23
          }
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcon name="account" size={30} color={color} />
          ),
          drawerLabelStyle: {
            fontSize: 23
          }
        }}
      />

    </Drawer.Navigator>
  );
}

const CustomDrawerComponent = (props: any) => {

  // Receive user_name as a prop from DrawerScreen
  const { user_name } = props; 
  const [username, setUsername] = useState('');

  useEffect(()=>{
    setUsername(user_name);
  },[])

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView>
        <View style={{ height: "100%" }}>
          {/* Display user profile picture and username */}
          <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#FCFBF4', marginTop: -5, padding: 10 }}>
            <Ionicons name="person-circle-outline" size={80} color='#7a5835' />
            <Text style={{ fontSize: 23 }}>{username}</Text>
          </View>
          {/* Display the list of drawer items */}
          <View style={{ backgroundColor: '#fff', marginTop: 8 }}>
            <DrawerItemList {...props} />
          </View>
        </View>
      </DrawerContentScrollView>

      {/* Settings section */}
      <View style={{ borderTopWidth: 1, borderTopColor: 'grey', padding: 10, marginTop: 8 }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Ionicons name="settings" size={30} />
            <Text
              style={{
                marginLeft: 20,
                fontSize: 30,
              }}>
              Setting
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Logout section */}
      <View style={{ borderTopWidth: 1, borderTopColor: 'grey', padding: 8 }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Ionicons name="exit-outline" size={30} />
            <Text
              style={{
                marginLeft: 20,
                fontSize: 30,
              }}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default DrawerScreen;

