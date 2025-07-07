import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { InputWithLabel } from "../UI";
import { AppContext } from '../AppContext';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, User } from "../Types";

export type Props = StackScreenProps<RootStackParamList, 'Login'>;

let config = require('../Config');

const LoginScreen = ({ navigation }: any) => {

  const { users, loadUsers, setUserId } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // load all the users in database
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadUsers(); // refresh the users list when screen is focused 
      // especially after sign up a new user
    });

    return unsubscribe; // clean up listener on unmount
  }, [navigation]);


  const _Login = () => {
    if (!username && !password) {
      Alert.alert("Login Failed", "Please enter username and password.");
    } else if (!username) {
      Alert.alert("Login Failed", "Please enter username");
    } else if (!password) {
      Alert.alert("Login Failed", "Please enter password");
    } else {
      // check whether the user has been registered or not
      const userFound = users.find(
        (user: User) => user.username === username && user.password === password,
      );

      if (userFound) {
        console.log('User ID: ', userFound.id);
        setUserId(userFound.id);
        Alert.alert("Login Successful", `Welcome, ${username}!`);
        navigation.navigate('Drawer', { user_id: userFound.id, user_name: userFound.username });
      } else {
        Alert.alert("Login Failed", "Invalid username or password.");
      }
    }
  };

  return (
    <View style={{ backgroundColor: '#fff', width: '100%', height: '100%', flex: 1, padding: 20 }}>
      <Image style={styles.picContainer} source={require('../img/loginPic.png')} />

      {/** Enter username and password */}
      <InputWithLabel
        label="Username"
        placeholder="Enter Your Username"
        value={username}
        onChangeText={(username: any) => setUsername(username)}
      />
      <InputWithLabel
        label="Password"
        placeholder="Enter Your Password"
        value={password}
        secureTextEntry={true}
        onChangeText={(password: any) => setPassword(password)}
      />

      {/** Login or SignUp button */}
      <TouchableOpacity onPress={() => _Login()} style={button.container}>
        <Text style={button.label}>Login</Text>
      </TouchableOpacity>
      <View>
        <TouchableOpacity
          style={[button.container, { backgroundColor: 'black' }]}
          onPress={() => {
            navigation.navigate('SignUp');
          }}
        >
          <Text style={button.label}>Sign Up</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  picContainer: {
    height: 300,
    width: 300,
    alignSelf: 'center',
    margin: 10,
    marginTop: 50,
  },
  label: {
    fontSize: 30,
    alignSelf: 'center',
    fontFamily: 'IntroRust-Base',
    color: '#ffffff',
  },
});

const button = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    height: 45,
    width: 350,
    borderRadius: 15,
    paddingTop: 5,
    alignSelf: 'center',
    margin: 6,
  },
  label: {
    color: 'white',
    fontSize: 25,
    alignSelf: 'center',
    fontFamily: 'IntroRust-Base',
    fontWeight: 'bold',
  },
});
