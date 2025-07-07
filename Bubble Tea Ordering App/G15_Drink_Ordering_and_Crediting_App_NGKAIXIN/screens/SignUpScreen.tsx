import React, { useState, useEffect, useContext  } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert} from "react-native";
import { InputWithLabel } from "../UI";
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, User } from "../Types";
import { AppContext } from '../AppContext';

export type Props = StackScreenProps<RootStackParamList, 'SignUp'>;

let config = require('../Config');

const SignUpScreen = ({navigation, route}: Props ) => {

    const { addUser }:any = useContext(AppContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState();
    const [password, setPassword] = useState('');
    const [confirmPw, setConfirmPw] = useState('');

    // save the new user
    const _save = () => {
      let url = config.settings.serverPath + '/api/users';
    
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          phone: phoneNumber,
          password: password
        }),
      })
        .then(response => {
          if (!response.ok) {
            Alert.alert('Error:', response.status.toString());
            throw Error('Error ' + response.status);
          }
          return response.json();
        })
        .then(respondJson => {
          if (respondJson.affected > 0) {            
            Alert.alert('Record save for',username) 

            addUser({
              id: respondJson.id, // make sure your backend returns this
              username,
              email,
              phone: phoneNumber,
              password,
            });
                      
          } else {
            Alert.alert('Error in SAVING');
          }
        })
        .catch(error => {
          console.log(error);
        });
    };

    // set the header title
    useEffect(()=>{
      navigation.setOptions({headerTitle: 'Add User'});
    },[]);

    return(
        <View style={{backgroundColor:'#fff',width:'100%', height:'100%'}}>

          {/** enter the user information */}
          <View style={styles.container}>
            <InputWithLabel
            label="Username"
            placeholder="Enter Your Username"
            value={username}
            onChangeText={(username:any) => setUsername(username)}
            />
            <InputWithLabel
            label="Email"
            placeholder="Enter Your Email"
            value={email}
            keyboardType='email-address'
            onChangeText={(email:any) => setEmail(email)}
            />
            <InputWithLabel
            label="Phone Number"
            placeholder="Enter Your Phone Number"
            value={phoneNumber}
            keyboardType='numeric'
            onChangeText={(phoneNumber:any) => setPhoneNumber(phoneNumber)}
            />
            <InputWithLabel
            label="Password"
            placeholder="Enter Your Password"
            value={password}
            secureTextEntry={true}
            onChangeText={(password:any) => setPassword(password)}
            />
            <InputWithLabel
            label="Comfirm Password"
            placeholder="Comfirm Your Password"
            value={confirmPw}
            secureTextEntry={true}
            onChangeText={(confirmPw:any) => setConfirmPw(confirmPw)}
            />

            {/** input validation */}
            <View>
                <TouchableOpacity style={[button.container,{backgroundColor:'black'}]} 
                    onPress={() => {
                      if (!username && !email && !phoneNumber && !password && !confirmPw){
                        Alert.alert("Sign Up Failed","Please fill in all the information.")
                      } else if (!username){
                        Alert.alert("Sign Up Failed", "Please enter your username")
                      } else if(!email){
                        Alert.alert("Sign Up Failed", "Please enter your email")
                      } else if(!phoneNumber){
                        Alert.alert("Sign Up Failed","Please enter your Phone Number")
                      } else if(!password){
                        Alert.alert("Sign Up Failed", "Please enter your password")
                      } else if (!confirmPw){
                        Alert.alert("Sign Up Failed", "Please enter confirm password")
                      } else if (!email.includes("@")){
                        Alert.alert("Sign Up Failed", "Invalid email address, Please enter email address that includes '@'.")
                      } else if (isNaN(phoneNumber)){
                        Alert.alert("Sign Up Failed", "Invalid phone number, please enter phone number only with digits.")
                      } else if (confirmPw != password){
                        Alert.alert("Sign Up Failed","The confirmation password does not match the original password. Please re-enter both fields. ")
                      } else{
                        // create the new user and navigate back to login screen
                        _save();
                        Alert.alert('Sign up Success', 'You had successfully sign up an account.');
                        navigation.navigate('Login')                        
                      }                      
                      }}>
                    <Text style={button.label}>Sign Up</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>       
        
    )
}

export default SignUpScreen;

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#f3f6f7', 
        borderRadius:20, 
        margin:15,
        marginTop:90, 
        padding:10,
    },
    tittle:{
        fontSize:50,
        fontWeight:'bold',
        color:'#704e2d',
        alignSelf:'center',
        margin:20,
        fontFamily:'IntroRust-Base',
    },
    topBanner:{
        backgroundColor:'#b3865d', 
        width:"auto", 
        height:45, 
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center', 
        padding:5
    },
})

const button = StyleSheet.create({
    container:{
      backgroundColor:'#87603b',
      height:45,
      width:350,
      borderRadius:15,
      paddingTop:5,
      alignSelf:'center',
      margin:6
    },
    label:{
      color:'#ffffff',
      fontSize:25,
      alignSelf:'center',
      fontFamily:'IntroRust-Base',
      fontWeight:'bold'
    }
})