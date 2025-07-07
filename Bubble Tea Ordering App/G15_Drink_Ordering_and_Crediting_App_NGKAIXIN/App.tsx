import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { RootStackParamList, StackOptionList } from './Types';
import LoginScreen from "./screens/LoginScreen"; 
import SignUpScreen from "./screens/SignUpScreen";
import DrawerScreen from "./screens/DrawerScreen";
import DrinksDetailsScreen from "./screens/DrinksDetailsScreen";
import SummaryScreen from "./screens/SummaryScreen";
import EditScreen from "./screens/EditScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PickUpScreen from "./screens/PickUpScreen";
import DeliveryScreen from "./screens/DeliveryScreen";
import CallScreen from "./screens/CallScreen";
import MessageScreen from "./screens/MessageScreen";
import { AppProvider } from './AppContext';


const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <AppProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={headerOptions}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={headerOptions}
          />
          <Stack.Screen
            name="Drawer"
            component={DrawerScreen}
            options={{ headerShown: false }}          
          />
          <Stack.Screen
            name="DrinksDetails"
            component={DrinksDetailsScreen}
            options={headerOptions}
          />
          <Stack.Screen
            name="Cart"
            component={SummaryScreen}
            options={headerOptions}
          />
          <Stack.Screen
            name="Edit"
            component={EditScreen}
            options={headerOptions}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={headerOptions}
          />
          <Stack.Screen
            name="Delivery"
            component={DeliveryScreen}
            options={headerOptions}
          />
          <Stack.Screen
            name="PickUp"
            component={PickUpScreen}
            options={headerOptions}
          />
          <Stack.Screen
            name="Call"
            component={CallScreen}
            options={headerOptions}
          />
          <Stack.Screen
            name="Message"
            component={MessageScreen}
            options={headerOptions}
          />
        </Stack.Navigator>
    </NavigationContainer>
  </AppProvider>
  );
}

const inputStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    //backgroundColor: 'lightblue',
  },
  text: {
    fontSize: 48,
    color: 'black'
  },
  input: {
    textAlign: 'center',
    marginRight: 20
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    marginBottom: 10
  }
});

const headerOptions: StackNavigationOptions = {
  headerStyle: {
    backgroundColor: '#fff',
  },
  headerTitleAlign: 'center',
  headerTintColor: 'black',
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 28,
  },
};


export default App;

