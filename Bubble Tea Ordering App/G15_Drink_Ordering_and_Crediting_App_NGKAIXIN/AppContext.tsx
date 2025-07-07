import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { User } from './Types';
import { getDB, getdrinks } from './db-service';

let config = require('./Config');

export const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: any) => {

  const [userId, setUserId] = useState('1');
  const [users, setUsers] = useState<User[]>([]);
  const [drinks, setDrinks] = useState<any>([]);
  const [orderId, setOrderId] = useState(null);
  const [orders, setOrders] = useState<User[]>([]);

  // Load users from server
  const loadUsers = async () => {
    try {
      const response = await fetch(config.settings.serverPath + '/api/users');
      const data = await response.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('Fetched data is not an array');
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  // Add user locally + optionally reload from server
  const addUser = async (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    await loadUsers(); // Make sure to sync with server
  };

  const loadDrinks = async () => {
    const dbDrinks = await getdrinks(await getDB());
    // console.log('DB Drinks:', dbDrinks); 

    const drinksImg = [
      { id: 1, image: require('./img/bubbleTea/brownSugar.jpg') },
      { id: 2, image: require('./img/bubbleTea/matcha.jpg') },
      { id: 3, image: require('./img/bubbleTea/redBean.jpg') },
      { id: 4, image: require('./img/bubbleTea/stawberryMilkTea.jpg') },
      { id: 5, image: require('./img/bubbleTea/taroMilkTea.jpg') },
      { id: 6, image: require('./img/bubbleTea/chocolate.jpg') },
      { id: 7, image: require('./img/FuitTea/honeyLemonTea.jpg') },
      { id: 8, image: require('./img/FuitTea/kiwiTea.jpg') },
      { id: 9, image: require('./img/FuitTea/lycheeTea.jpg') },
      { id: 10, image: require('./img/FuitTea/passionFruitTea.jpg') },
      { id: 11, image: require('./img/FuitTea/peachTea.jpg') },
      { id: 12, image: require('./img/FuitTea/orange.jpg') },
      { id: 13, image: require('./img/Smoothie/avocadoSmoothie.jpg') },
      { id: 14, image: require('./img/Smoothie/blueberrySmoothie.jpg') },
      { id: 15, image: require('./img/Smoothie/mangoSmoothie.jpg') },
      { id: 16, image: require('./img/Smoothie/strawberrySmoothie.jpg') },
      { id: 17, image: require('./img/Smoothie/watermelonSmoothie.jpg') },
      { id: 18, image: require('./img/Smoothie/carrot.jpg') }
    ];

    const merged = dbDrinks.map((drink: any) => {
      const local = drinksImg.find((d) => d.id === drink.id);
      return {
        ...drink,
        image: local && local.image ? local.image : null,
      };
    });

    // console.log('DB Drinks:', merged);
    setDrinks(merged);
  };

  const fetchOrders = async (user_id: string) => {
    let url = config.settings.serverPath + '/api/orders/user/' + user_id;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        Alert.alert('Error:', response.status.toString());
        throw Error('Error ' + response.status);
      }
      let fetchedOrders = await response.json();

      if (Array.isArray(fetchedOrders)) {
        fetchedOrders.sort((a, b) => new Date(b.order_time).getTime() - new Date(a.order_time).getTime());
        setOrders(fetchedOrders);
      } else if (fetchedOrders.message) {
        Alert.alert('Info', fetchedOrders.message);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to fetch orders.');
    }
  };

  // load address of the order
  const loadAddress = async (order_id: string) => {
    let url = config.settings.serverPath + '/api/orders/' + order_id;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            Alert.alert('Error:', response.status.toString());
            throw new Error('Error ' + response.status);
        }

        const order = await response.json();
        if (order) {
          console.log(order);
            console.log('Fetched address:', order.address);
            return order.address;
        } else {
            console.log('Address not found');
            return 'Address not found';
        }
    } catch (error) {
        console.error('Failed to load address:', error);
        return 'Failed to load address';
    }
};

  useEffect(() => {
    loadUsers();
    loadDrinks();
    fetchOrders(userId);
  }, [userId]);

  return (
    <AppContext.Provider
      value={{
        userId, setUserId,
        users, addUser, loadUsers,
        drinks, loadDrinks,
        orderId, setOrderId,
        orders, setOrders, fetchOrders,
        loadAddress
      }}>
      {children}
    </AppContext.Provider>
  );
};
