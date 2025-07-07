import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  ScrollView,
  View,
  SafeAreaView,
} from 'react-native';
import io from 'socket.io-client';
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from "../Types";

export type Props = StackScreenProps<RootStackParamList, 'Message'>;

var socket = io('http://10.0.2.2:5000/chat', {
  transports: ['websocket'],
});

type Message = {
  sender: string;
  message: string;
  timestamp: string;
}

const MessageScreen = ({ route, navigation }: Props) => {

  const { userName } = route.params;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // When connected, emit a message to the server to inform that this client has connected to the server.
    // Display a Toast to inform user that connection was made.
    socket.on('connect', () => {

      console.log(socket.id); // undefined
      socket.emit('mobile_client_connected', { connected: true }, (response: any) => {
        console.log(response)
      });
      ToastAndroid.show('Connected to server', ToastAndroid.LONG);
    });

    socket.on('connect_to_client', (data: any) => {
      let greets = JSON.parse(data)
      console.log(greets)
    });

    // Handle connection error
    socket.on('error', (error: any) => {
      ToastAndroid.show('Failed to connect to server', ToastAndroid.LONG);
    });

    // Receive chat broadcast from server.
    socket.on('message_broadcast', (data: any) => {
      console.log(data);
      let messageBag = JSON.parse(data);

      setMessages(prev => [...prev, messageBag]);

      const chatbox = () => {
        return (
          <View style={styles.chatbox}>
            {messageBag.message}
          </View>
        )
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ paddingLeft: 10, paddingRight: 10 }}>
        {messages.map((msg, index) => {
          const isMine = msg.sender === userName; // Check if it's my message
          return (
            <View
              key={index}
              style={[
                styles.chatbox,
                isMine ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' },
              ]}
            >
              <View style={isMine ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }}>
                <Text style={styles.sender}>{msg.sender}</Text>
              </View>
              <View
                style={[
                  styles.chatbox,
                  isMine ? styles.myMessage : styles.otherMessage,
                ]}
              >
                <Text style={styles.message}>{msg.message}</Text>
              </View>
              <Text style={styles.timestamp}>{msg.timestamp}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12 }}>
        <TextInput
          style={[styles.input, { width: 250 }, { marginRight: 10 }]}
          placeholder="Enter message"
          value={message}
          selectTextOnFocus={true}
          onChangeText={(message: string) => { setMessage(message) }}
        />
        <TouchableOpacity onPress={() => {
          socket.emit('message_sent', {
            sender: userName,
            message: message,
          })
        }}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>SEND</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 10,
    backgroundColor: '#c49a66',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  input: {
    fontSize: 16,
    color: '#000000',
    marginTop: 10,
    marginBottom: 10,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 30,
    padding: 12,
  },
  output: {
    height: 400,
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
    color: 'black',
  },
  button: {
    padding: 10,
    backgroundColor: 'black',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: 95,
    height: 55
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20
  },
  chatbox: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
  myMessage: {
    backgroundColor: '#e4e7ed',
    alignSelf: 'flex-end',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
  otherMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  sender: {
    fontWeight: 'bold',
    color: 'black',
  },
  message: {
    fontSize: 16,
    color: 'black',
  },
  timestamp: {
    fontSize: 10,
    color: 'gray',
    marginTop: 5,
  },

});

export default MessageScreen;