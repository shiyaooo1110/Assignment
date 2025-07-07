import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import orderItems from "../Orders";
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from "../Types";
import { AppContext } from "../AppContext";

export type Props = StackScreenProps<RootStackParamList, 'PickUp'>;

const PickUpScreen = ({ route, navigation }: Props) => {

  const { loadAddress } = useContext(AppContext);
  const { orderId } = route.params;
  const [progress, setProgress] = useState(0);
  const [pickupTime, setPickupTime] = useState('');
  const [address, setAddress] = useState('');

  const processes = [
    {
      ID: 1,
      title: 'Order Placed',
      description: 'We have received your order',
      buttonIcon: "clipboard-text-outline"
    },
    {
      ID: 2,
      title: 'Processing',
      description: 'We are preparing your order',
      buttonIcon: "silverware-fork-knife"
    },
    {
      ID: 3,
      title: 'Ready for Pickup',
      description: 'Your order is ready for pickup',
      buttonIcon: "store-check-outline"
    }
  ]
  //USEEFFECT FOR ESTIMATED PICKUP TIME
  useEffect(() => {
    const first = 10; // first order need to wait 10 mins
    const ordersInQueue = 3;
    const totalTime = first + ordersInQueue * 5; // add 5 mins per order
    const orderTime = new Date();
    orderTime.setMinutes(orderTime.getMinutes() + totalTime);
    setPickupTime(orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); // Print Time

    const fetchAddress = async () => {
      const addr = await loadAddress(orderId);
      setAddress(addr);
    };
    fetchAddress();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.upperPart}>
        <Text style={styles.pickup}>Estimated Delivery Time:</Text>
        <Text style={styles.order}>Order #{orderId}</Text>
      </View>
      <Text style={styles.time}>{pickupTime}</Text>

      {/** process of order */}
      <View style={styles.outerbox}>
        <View style={{ flex: 1 }}>
          {processes.map(process => (
            <View key={process.ID}>

              <View style={styles.trackbarDistance}>
                <Text style={styles.circle}>◯</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.line}>│</Text>
                <View style={styles.overall}>
                  <View style={styles.iconInside}>
                    <MaterialCommunityIcons
                      name={process.buttonIcon}
                      size={24}
                      color={progress >= process.ID ? 'green' : 'gray'}
                      style={styles.wordDistance}
                    />
                    <View style={styles.textBlock}>
                      <Text style={[styles.TitleInside, progress >= process.ID && styles.active]}>
                        {process.title}
                      </Text>
                      <Text style={[styles.DescriptionInside, progress >= process.ID && styles.active]}>
                        {process.description}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

            </View>
          ))}
        </View>
      </View>

      {/* Pickup Address */}
      <View style={{ margin: 10 }}>
        <Text style={styles.bigTitle}>Pickup Address:</Text>
        <View style={styles.deliveryAddressFormat}>
          <MaterialCommunityIcons name="storefront" size={40} color="#939DA9" />
          <View style={styles.pickupAddress}>
            <Text style={styles.address}>{address}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default PickUpScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    flexGrow: 1,
  },
  upperPart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  pickup: {
    fontSize: 16,
    color: 'black',
    fontWeight: "bold",
  },
  order: {
    fontSize: 16,
    color: '#666964',
    fontWeight: "600",
  },
  time: {
    fontSize: 16,
    color: '#454343',
    marginBottom: 10,
    fontWeight: '500',
  },
  outerbox: {
    borderWidth: 1,
    borderColor: "#7a5835",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  trackbarDistance: {
    alignItems: "center",
    width: 30,
    marginRight: 10,
    marginBottom: 10,
  },
  circle: {
    width: 10,
    height: 10,
    marginTop: 5,
    borderRadius: 5,
    backgroundColor: "gray",
  },
  line: {
    width: 2,
    height: 60,
    marginLeft: 13,
    backgroundColor: "gray",
  },
  active: {
    backgroundColor: "green",
  },
  overall: {
    flex: 1,
    paddingLeft: 40,
  },
  iconInside: {
    flexDirection: "row",
    alignItems: "center",
  },
  wordDistance: {
    marginRight: 15,
  },
  textBlock: {
    flexShrink: 1,
  },
  TitleInside: {
    color: 'black',
    fontWeight: "600",
    fontSize: 16,
  },
  DescriptionInside: {
    fontSize: 14,
    fontWeight: "400",
    color: "#454343",
  },
  bigTitle: { 
    fontWeight: "bold",
    color: 'black',
    fontSize: 16,
    marginBottom: 4,
  },
  address: { 
    color: 'black',
    fontSize: 14,
  },
  deliveryAddressFormat: {
    flexDirection: "row",
    alignItems: "center",

  },
  pickupAddress: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginLeft: 10,
    flexShrink: 1,
  },
});
