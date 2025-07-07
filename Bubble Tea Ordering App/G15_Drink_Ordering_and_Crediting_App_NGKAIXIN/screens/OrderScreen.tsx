import React, { useEffect, useContext, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Alert,
  StyleSheet,
  Image,
  FlatList
} from 'react-native';
import dayjs from 'dayjs';
import { AppContext } from '../AppContext';
import { useFocusEffect } from '@react-navigation/native';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

let config = require('../Config');

const OrderScreen = ({ route, navigation }: any) => {

  const { user_id, user_name }: any = route.params;
  const { drinks } = useContext(AppContext);
  console.log('OrderScreen received user: ', user_name, ' (user_id: ', user_id, ')');

  const [orders, setOrders] = useState<any[]>([]);

  // merge the drink with related image
  const mergeDrinkImage = (apiItem: any, contextDrinks: any) => {
    const match = contextDrinks.find((ctxItem: any) => ctxItem.id === apiItem.drink_id);
    return match ? match.image : require('../img/brownsugar.jpg');
  };

  // fecth order by user_id
  const fetchOrders = async () => {
    let url = config.settings.serverPath + '/api/orders/user/' + user_id;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        Alert.alert('Error:', response.status.toString());
        throw Error('Error ' + response.status);
      }
      const orders = await response.json();

      if (Array.isArray(orders)) {
        orders.sort((a, b) => new Date(b.order_time).getTime() - new Date(a.order_time).getTime());
        setOrders(orders);
      } else if (orders.message) {
        Alert.alert('Info', orders.message);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to fetch orders.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [user_id])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Order</Text>

      {orders.map((order, index) => {
        
        // compare today date with the order date
        const date = new Date(order.order_time).toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        const isToday = today === date;
        console.log('Order Date:', order.order_time);
        console.log('Is today:', isToday);

        return (
          <View key={order.order_id ? `order-${order.order_id}` : `order-index-${index}`} style={{ marginBottom: 30 }}>
            {/** render each order */}
            <Text style={{ color: 'black' }}>{dayjs(order.order_time).format('YYYY-MM-DD HH:mm:ss')}</Text>
            <View>
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 8 }}>
                  <Text style={styles.name}>Order ID: {order.order_id}</Text>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={{ color: 'black' }}>Total Price: RM{order.total_price}</Text>
                    <Text style={{ color: 'black' }}>Order Type: {order.order_type}</Text>
                  </View>
                </View>
                {/** list out all the order_items for each order */}
                <FlatList
                  data={order.items}
                  scrollEnabled={false}
                  keyExtractor={(item: any, index) =>
                    item.order_item_id ? `item-${item.order_item_id}` : `item-index-${index}`
                  }
                  renderItem={({ item }: any) => (
                    <View style={styles.orderList}>
                      <View>
                        <Image style={styles.imagePlace} source={mergeDrinkImage(item, drinks)} />
                      </View>

                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={styles.drinkTitle}>{item.name}</Text>
                        </View>
                        <Text style={styles.detail}>{`${item.sugar_level}, ${item.ice_level}`}</Text>
                        <Text style={styles.detail}>{item.size}</Text>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.detail}>Topping: </Text>
                          <Text style={styles.detail}>{item.toppings ? item.toppings : 'None'}</Text>
                        </View>
                        <View style={{ flex: 1, marginLeft: 10, justifyContent: 'space-between', flexDirection: 'row' }}>
                          <Text style={styles.detail}>Quantity: {item.quantity}</Text>
                          <Text style={[styles.detail, { color: '#000', fontSize: 14 }]}>{item.drink_price}</Text>
                        </View>
                      </View>
                    </View>
                  )}
                />
              </View>
            </View>

            {/** display the Track Order button if the order date is today */}
            <View style={{ width: 150, alignSelf: 'flex-end' }}>
              {isToday && (
                <Button
                  title="Track Order"
                  color='#000'
                  onPress={() => {
                    if (order.order_type.toLowerCase() === 'delivery') {
                      navigation.navigate('Delivery', { orderId: order.order_id, name: user_name });
                    } else {
                      navigation.navigate('PickUp', { orderId: order.order_id });
                    }
                  }}
                />
              )}
            </View>

          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    margin: 8,
    color: '#000',
  },
  orderHeader: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  itemHeader: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  itemCard: {
    marginLeft: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
    alignSelf: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 15,
    // color: '#000',
    marginRight: 5,
    alignSelf: 'flex-end'
  },
  details: {
    flexDirection: 'column',
    alignSelf: 'center',
    marginLeft: 8,
    width: '65%',
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
    color: '#000',
  },

  detail: {
    color: 'grey',
    fontSize: 12,
  },
});

export default OrderScreen;