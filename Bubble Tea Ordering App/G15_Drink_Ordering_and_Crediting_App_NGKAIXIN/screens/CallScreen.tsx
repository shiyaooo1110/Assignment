import React , {useState} from "react";
import {StyleSheet, View, Text, TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from "../Types";

export type Props = StackScreenProps<RootStackParamList, 'Call'>;

const CallScreen = ({route, navigation}:any) => {

  // get phone number from previous screen
  const {phone} = route.params;

    return(
        <View style={styles.container}>
            <View style = {styles.Usericon}>
               <Ionicons name = 'person' size = {50} color = 'black'/>
            </View>
            <View>
               <Text style={{ fontSize: 30, fontWeight: 'bold', marginLeft: 10 }}>{phone}</Text>
            </View>
            <View style = {{margin: 50}}>
               <View style = {styles.icon}>
                  <ActiveIcon icon = "mic-off" label = "     Mute"/>
                  <ActiveIcon icon = "keypad" label = "   Keypad"/>
                  <ActiveIcon icon = "volume-high" label = "   Speaker"/>
               </View>
               <View style = {styles.icon}>
                  <ActiveIcon icon = "add" label = "   AddCall"/>
                  <ActiveIcon icon = "videocam" label = " VideoCall"/>
                  <ActiveIcon icon = "pause" label = "      Hold"/>
               </View>
            </View>
            <View style = {styles.Usericon}>
                <TouchableOpacity onPress={() => {navigation.goBack()}}>
                  <Ionicons name = 'call' size = {50} color = 'red'/>
                </TouchableOpacity>
            </View>
        </View>

    )
};

const ActiveIcon = ({ icon, label}:any) => {
  const [isActive, setIsActive] = useState(false);

  const handlePress = () => {
    setIsActive(!isActive);
  };

  return (
    <View>
      <TouchableOpacity style={styles.actionIcon} onPress={handlePress}>
        <Ionicons name={icon} size={50} color={isActive ? 'green' : 'black'} />
      </TouchableOpacity>

      <Text style={styles.content}>{label}</Text>
    </View>
  );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      },

    Usericon: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        margin: 5,
    },

    icon: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 300,
        marginBottom: 30,
    },

    content: {
        fontSize: 15, 
        fontWeight: 'bold', 
        marginLeft: 20
    },

    actionIcon: { 
      alignItems: 'center',
      justifyContent: 'center',  
      backgroundColor: '#e4e7ed',
      width: 70,  
      height: 70, 
      borderRadius: 35, 
      borderWidth: 3, 
      borderColor:'#e4e7ed',
      marginHorizontal: 20, 
  },
  
})

export default CallScreen;