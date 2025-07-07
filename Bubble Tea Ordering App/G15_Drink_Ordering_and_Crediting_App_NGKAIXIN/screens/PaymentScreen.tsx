import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ScrollView,
  SafeAreaView,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from "../Types";

export type Props = StackScreenProps<RootStackParamList, 'Payment'>;

let config = require('../Config')

const PaymentScreen = ({ route, navigation }: Props) => {

  const { userId, orderId, price, type, address } = route.params;
  const [phone, setPhone] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('Credit Card');
  const [discountCode, setDiscountCode] = useState('');

  const [user, setUser]: any = useState();
  const [isFetching, setIsFetching] = useState(false);

  const [bank, setBank] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [eWallet, setEWallet] = useState('');

  // list all the bank options
  let banks = [
    { label: 'Maybank', value: 'mae' },
    { label: 'Public Bank', value: 'pbb' },
    { label: 'CIMB', value: 'cimb' },
    { label: 'HSBC Malaysia', value: 'hsbc' },
    { label: 'Hong Leong Bank', value: 'hlb' },
    { label: 'Ambank', value: 'ambank' },
    { label: 'UOB Malaysia', value: 'uob' },
    { label: 'OCBC Malaysia', value: 'ocbc' },
    { label: 'Affin Bank', value: 'affin' },
    { label: 'Alliance  Bank', value: 'alliance' },
    { label: 'Bank Islam', value: 'bankIslam' },
  ];

  // list out all the eWallets payment options
  let eWallets = [
    { label: 'Touch N Go', value: 'tng' },
    { label: 'GrabPay', value: 'grab' },
    { label: 'ShopeePay', value: 'shopee' },
    { label: 'Boost', value: 'boost' },
    { label: 'Lazada', value: 'lazada' },
  ];

  const _load_user = () => {
    let url = config.settings.serverPath + '/api/users/' + userId;
    setIsFetching(true);

    fetch(url)
      .then(response => {
        console.log(response);
        if (!response.ok) {
          Alert.alert('Error:', response.status.toString());
          throw Error('Error ' + response.status);
        }
        setIsFetching(false);
        return response.json();
      })
      .then(user => {
        setUser(user);
        console.log(user);
        setPhone(user.phone);
      })
      .catch(error => {
        console.log(error);
      });
  }

  // create the order 
  const _createOrder = async () => {
    let url = `${config.settings.serverPath}/api/orders/${orderId}`;

    const payload = {
      order_id: orderId,
      user_id: userId,
      phone: phone,
      order_type: type,
      total_price: parseFloat(price),
      address: address
    };

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message);
      } else {
        Alert.alert('Error', data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      Alert.alert('Error', 'Failed to update order.');
    }

  };


  useEffect(() => {
    _load_user();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1, margin: 15 }}>
        {/** banner part */}
        <View style={styles.header}>
          <Image
            style={styles.image}
            source={require('../img/loginPic.png')}
          />
          <View style={styles.order}>
            <Text style={{ fontSize: 20, color: 'black' }}>
              Order Summary
            </Text>
            <Text style={{ fontSize: 20, color: 'black' }}>
              Order ID: {orderId}
            </Text>
          </View>
        </View>

        {/** payment options */}
        <View>
          <Text style={styles.title}>
            Payment
          </Text>
          <Text style={styles.description}>
            All the transaction are secured & encrypted
          </Text>
          <View style={styles.radioButton}>
            <RadioButton
              value="Credit Card"
              status={selectedPayment === 'Credit Card' ? 'checked' : 'unchecked'}
              onPress={() => setSelectedPayment('Credit Card')}
              color="#45392b"
            />
            <Text style={styles.radioLabel}>
              Credit / Debit Card Payment
            </Text>
            <Image
              style={{ height: 40, width: 40, marginLeft: 10 }}
              source={require('../img/creditCard.png')}
            />
          </View>
          {selectedPayment === 'Credit Card' && (
            <View style={{ padding: 5, backgroundColor: '#e4e7ed', borderRadius: 10 }}>
              <Text style={styles.description}>
                Bank :
              </Text>
              <Picker
                style={styles.picker}
                prompt={'Please select a bank'}
                selectedValue={bank}
                onValueChange={(itemValue, itemIndex) => {
                  setBank(itemValue);
                }}
              >
                {banks.map((item, index) => {
                  return <Picker.Item label={item.label} value={item.value} key={item.value} />;
                })}
              </Picker>
            </View>
          )}
          <View style={styles.radioButton}>
            <RadioButton
              value="Online Payment"
              status={selectedPayment === 'Online Payment' ? 'checked' : 'unchecked'}
              onPress={() => {
                setSelectedPayment('Online Payment')
              }}
              color="#45392b"
            />
            <Text style={styles.radioLabel}>
              Online Payment
            </Text>
            <Image
              style={{ height: 40, width: 40, marginLeft: 10 }}
              source={require('../img/onlinePayment.png')}
            />
          </View>
          {selectedPayment === 'Online Payment' && (
            <View style={{ padding: 5, backgroundColor: '#e4e7ed', borderRadius: 10 }}>
              <Text style={styles.description}>
                Bank :
              </Text>
              <Picker
                style={styles.picker}
                prompt={'Please select a bank'}
                selectedValue={bank}
                onValueChange={(itemValue, itemIndex) => {
                  setBank(itemValue);
                }}
              >
                {banks.map((item, index) => {
                  return <Picker.Item label={item.label} value={item.value} key={item.value} />;
                })}
              </Picker>
              <Text style={styles.description}>
                Card Number:
              </Text>
              <TextInput
                style={[styles.input, { margin: 5 }]}
                onChangeText={(cardNumber) => setCardNumber(cardNumber)}
                value={cardNumber}
                placeholder={'Card Number'}
                keyboardType={'number-pad'}
              />
            </View>
          )}
          <View style={styles.radioButton}>
            <RadioButton
              value="E-wallet Payment"
              status={selectedPayment === 'E-wallet Payment' ? 'checked' : 'unchecked'}
              onPress={() => setSelectedPayment('E-wallet Payment')}
              color="#45392b"
            />
            <Text style={styles.radioLabel}>
              E-wallet Payment
            </Text>
            <Image
              style={{ height: 40, width: 40, marginLeft: 10 }}
              source={require('../img/eWallet.png')}
            />
          </View>
          {selectedPayment === 'E-wallet Payment' && (
            <View style={{ padding: 5, backgroundColor: '#e4e7ed', borderRadius: 10 }}>
              <Text style={styles.description}>
                e-Wallet :
              </Text>
              <Picker
                style={styles.picker}
                prompt={'Please select a e-Wallet'}
                selectedValue={eWallet}
                onValueChange={(itemValue: any) => {
                  setEWallet(itemValue);
                }}
              >
                {eWallets.map((item, index) => {
                  return <Picker.Item label={item.label} value={item.value} key={item.value} />;
                })}
              </Picker>
            </View>
          )}
        </View>

        {/** Customer contact details */}
        <View >
          <Text style={styles.title}>
            Contact
          </Text>
          <TextInput
            style={[styles.input, { marginTop: 5 }]}
            onChangeText={(phone) => setPhone(phone)}
            value={phone}
            placeholder={'Phone Number, eg.012-3456789'}
            keyboardType={'phone-pad'}
          />
        </View>

        {/** Voucher part */}
        <View>
          <Text style={styles.title}>
            Add Voucher
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={[styles.input, { width: 240 }, { marginRight: 10 }]}
              onChangeText={(text) => setDiscountCode(text)}
              value={discountCode}
              placeholder={'Discount code'}
            />
            <TouchableHighlight onPress={() => { }} underlayColor="white">
              <View style={styles.button}>
                <Text style={styles.buttonText}>Apply</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </ScrollView>

      {/** footer part with total price and button to create order*/}
      <View style={{ margin: 5 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.footerText}>
            Total
          </Text>
          <Text style={[styles.footerText, { fontWeight: 'bold' }]}>
            RM {price}
          </Text>
        </View>
        <View style={{ margin: 10, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableHighlight
            onPress={() => {
              _createOrder();
              console.log('username: ', user.username);
              navigation.navigate('Drawer', {
                user_id: userId,
                user_name: user.username,
              });
            }}
            underlayColor="white"
          >
            <View style={[styles.button, { width: 360 }]}>
              <Text style={styles.buttonText}>Check Out</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    alignSelf: 'center'
  },
  order: {
    fontSize: 20,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    flexDirection: 'row',

    marginTop: 5
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 15,
  },
  description: {
    fontSize: 18,
    color: 'black'
  },
  input: {
    fontSize: 20,
    height: 48,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#e4e7ed',
  },
  button: {
    width: 110,
    height: 48,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingRight: 10,
    marginBottom: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 20
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 18,
    color: 'black',
  },
  footerText: {
    margin: 8,
    fontSize: 20,
    color: 'black'
  },
  picker: {
    color: 'black',
  },
})

export default PaymentScreen;