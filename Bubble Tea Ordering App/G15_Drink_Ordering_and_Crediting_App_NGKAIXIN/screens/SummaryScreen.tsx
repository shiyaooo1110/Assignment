import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppContext } from "../AppContext";
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from "../Types";

export type Props = StackScreenProps<RootStackParamList, 'Cart'>;

let config = require('../Config')

const SummaryScreen = ({ route, navigation }: Props) => {

  const { user_id } = route.params;
  const { orderId, drinks } = useContext(AppContext);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [isDelivery, setIsDelivery] = useState(false);
  const [selectedDrinks, setSelectedDrinks] = useState([]);

  // delivery or pickUp address
  const [address, setAddress] = useState('No 353, Jalan Poh Ai, Batu 11 Cheras, Balakong, Selangor');
  const [pickUpAddress, setPickUpAddress] = useState('Bubble Tea, Batu 11 Cheras, Balakong, Selangor');  

  // formated the delivery or pickUp time
  const formatted = (inputTime:any) => {
    let hour = inputTime.getHours();
    let minute = inputTime.getMinutes();
    const time = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;  
    minute = minute < 10 ? '0' + minute : minute;
    return `${hour}:${minute} ${time}`;
  };
  
  // calculate the total price
  const getTotal = () => {
    let total = 0;
    (selectedDrinks || []).forEach((item:any) => {
      const price = parseFloat(item.drink_price.replace('RM', '').trim());
      const quantity = parseInt(item.quantity);
      total += price * quantity;
    });
    return total.toFixed(2);
  };
  
  // fetch the order items
  useEffect(() => {
    _getOrder_Item();
  }, []);

  // add the order items with image
  const mergeDrinkImages = (apiDrinks:any, contextDrinks:any) => {
    const mergedArray = apiDrinks.map((apiItem:any) => {
      const match = contextDrinks.find((ctxItem:any) => ctxItem.id === apiItem.drink_id);
      console.log('Matching item for', apiItem.drink_id, ':', match);
      return {
        ...apiItem,
        image: match ? match.image : require('../img/brownsugar.jpg'), // fallback image
      };
    });
    // console.log('Merged array:', mergedArray);
    setSelectedDrinks(mergedArray);
  };
  
  // get the order items by order id
  const _getOrder_Item = async () => {
    let url = config.settings.serverPath + `/api/orders/${orderId}`;
    console.log('Order id: ', orderId);
    try {
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            Alert.alert('Error', 'Nothing inside the cart');
            throw Error('Error ' + response.status);
        }

        let responseJson = await response.json();
        console.log('Fetched Order Items:', responseJson);

        // Check if order_id exists in the response
        if (!responseJson.order_id) {
            Alert.alert('Error', 'Order not found');
            return;
        }

        // Check if order_time exists (order has been placed)
        if (responseJson.order_time) {
            console.log('Order has already been placed. Skipping processing.');
            return;
        }

        // Proceed if items array exists and is valid
        if (Array.isArray(responseJson.items)) {
            mergeDrinkImages(responseJson.items, drinks);
        } else {
            console.warn('responseJson.items is not an array:', responseJson.items);
            setSelectedDrinks([]);
        }
    } catch (error) {
        console.error(error);
        setSelectedDrinks([]);
    }
};

  // delete the drink
  const _delete = (drink_id: any, name: any) => {
    Alert.alert('Confirm to DELETE', name, [
      {
        text: 'No',
        onPress: () => { },
      },
      {
        text: 'Yes',
        onPress: () => {
          const url =
            `${config.settings.serverPath}/api/order_items/order/${orderId}/drink/${drink_id}`;
          console.log(url);
          fetch(url, {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          })
            .then(response => {
              if (!response.ok) {
                Alert.alert('Error:', response.status.toString());
                throw Error('Error ' + response.status);
              }
              return response.json();
            })
            .then(responseJson => {
              if (responseJson.affected == 0) {
                Alert.alert('Error in DELETING');
              } else {
                _getOrder_Item();
              }
            })
            .catch(error => {
              console.error(error);
            });
        },
      },
    ]);
  }

  const onChangeTime = (event:any, selectedTime:any) => {
    setShowPicker(false)
    if (selectedTime)
      setSelectedTime(selectedTime)
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>

        {/** Delivery or PickUp details */}
        <View style={styles.contentContainer}>
          <View style={{ marginBottom: 10 }}>
            <View style={styles.rowBetween}>
              <Text style={styles.sectionTitle}>
                {isDelivery ? 'Delivery Details' : 'Pickup Details'}
              </Text>
              <TouchableOpacity style={[styles.toggleButton,
              !isDelivery && styles.activeToggleButton]}
                onPress={() => { setIsDelivery(false) }}>
                <Text style={styles.toggleText}>Pick up</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleButton,
              isDelivery && styles.activeToggleButton]}
                onPress={() => { setIsDelivery(true) }}>
                <Text style={styles.toggleText}>Delivery</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.detailAddress}>
              <Ionicons name='home-outline' size={30} color='#7a5835' />
              {isDelivery ?  
              <TextInput
                style={[styles.detailText, { padding: 0 }]}
                value={address}
                onChangeText={setAddress}
                multiline
              />
              : <TextInput
              style={[styles.detailText, { padding: 0 }]}
              value={pickUpAddress}
              onChangeText={setPickUpAddress}
              multiline
            />}
              <TouchableOpacity style={styles.editIcon}>
                <Ionicons name="create-outline" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.line}></View>

            <View style={styles.detailClock}>
              <Ionicons name='time-outline' size={30} color='#7a5835' />
              <Text style={[styles.detailText,{color:'black'}]}>Today, {formatted(selectedTime)}</Text>
              <TouchableOpacity style={styles.editIcon} onPress={() => { setShowPicker(true) }}>
                <Ionicons name="create-outline" size={24} />
              </TouchableOpacity>
            </View>

            {showPicker &&
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                is24Hour={false}
                onChange={onChangeTime}
              />}
          </View>
        </View>

        {/** list out all the order items */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <FlatList
            data={selectedDrinks}
            scrollEnabled={false}
            keyExtractor={(item:any, index) => `${item.drink_id}_${index}`}
            renderItem={({ item }) => (
              <View style={styles.orderList}>
                <View>
                  <Image style={styles.imagePlace} source={item.image} />
                </View>

                <View style={{ flex: 1, marginLeft: 10 }}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.drinkTitle}>{item.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity style={styles.editIcon}>
                        <Ionicons name="create-outline" size={24} onPress={() => { 
                          navigation.navigate('Edit', {
                            order_id: orderId,
                            drink_id: item.drink_id,
                          });
                          }} />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.editIcon} onPress={() => _delete(item.drink_id, item.name)}>
                        <Ionicons name="trash-outline" size={24} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.detail}>{`${item.sugar_level}, ${item.ice_level}`}</Text>
                  <Text style={styles.detail}>{item.size}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.detail}>Topping: </Text>
                    <Text style={styles.detail}>{item.toppings ? item.toppings : 'None'}</Text>
                    </View>
                  <View style={{ flex: 1, marginLeft: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Text style={styles.detail}>Quantity: {item.quantity}</Text>
                    <Text style={[styles.detail,{color:'#000', fontSize:14}]}>{item.drink_price}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/** Footer: display the total price and create order button */}
      <View style={styles.footer}>
        <View style={styles.rowSpace}>
          <Text style={styles.bottomText}>Grand Total</Text>
          <Text style={styles.bottomText}>RM {getTotal()}</Text>
        </View>
        <View>
          <TouchableOpacity 
            style={styles.bottomButton}
            onPress={() => {navigation.navigate('Payment',{
              orderId: orderId,
              userId: user_id,
              address: isDelivery? address: pickUpAddress,
              type: isDelivery? 'delivery':'pick-up',
              price: getTotal(),
            })
          }
          }
          >
            <Text style={styles.bottomText}>Order Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },

  backButton: {
    position: 'absolute',
    left: 16,
  },

  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#f4a460',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },

  titleSpace: {
    flex: 1,
    alignItems: 'center',
  },

  scrollContainer: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000'
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },

  toggleButton: {
    backgroundColor: 'white',
    paddingHorizontal: 5,
    paddingVertical: 3,
    marginHorizontal: 3,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  activeToggleButton: {
    backgroundColor: '#ebd4b0',
  },

  toggleText: {
    color: 'black',
    fontWeight: 'bold',
  },

  detailAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
    elevation: 2,
  },

  detailClock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 10,
    elevation: 2,
  },

  line: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },

  detailText: {
    flex: 1,
    fontSize: 14,
  },

  ContentContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    marginBottom: 20,
  },

  editIcon: {
    marginLeft: 'auto',
  },

  orderList: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 18,
    marginBottom: 10,
  },

  imagePlace: {
    width: 50,
    height: 50,
    backgroundColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  drinkTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color:'#000',
  },

  detail: {
    color: 'grey',
    fontSize: 12,
  },

  seconddetail: {
    color: 'grey',
    fontSize: 12,
    justifyContent: 'space-between',
  },

  footer: {
    backgroundColor: 'white',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },

  rowSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  bottomText: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'white',
  },

  bottomButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    margin: 10,
  },

  contentContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#ebd4b0',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 10,
    paddingBottom:15
  }
})

export default SummaryScreen;
