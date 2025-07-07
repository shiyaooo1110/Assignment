import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import drivers from '../Drivers'; // Assuming this is your initial driver data
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from "../Types";
import { AppContext } from '../AppContext';

export type Props = StackScreenProps<RootStackParamList, 'Delivery'>;

const DeliveryScreen = ({ route, navigation }: Props) => {

    const { loadAddress } = useContext(AppContext);
    const { orderId, name } = route.params;

    const [progress, setProgress] = useState(0);
    const [DeliveryTime, setDeliveryTime] = useState('');
    const [assignedDriver, setAssignedDriver] = useState<{ name: string; plate: string; phone: string } | null>(null);
    const [address, setAddress] = useState('');

    // Steps involved in the delivery process
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
            title: 'On The Way',
            description: 'Your order is out of delivery',
            buttonIcon: "moped"
        },
        {
            ID: 4,
            title: 'Order arrived',
            description: 'Your order have arrived',
            buttonIcon: "store-check-outline"
        }
    ]

    // Assigning a random driver from AsyncStorage
    useEffect(() => {
        const storeAndAssignDriver = async () => {
            try {
                // Store drivers if they aren't already saved in AsyncStorage
                let storedDrivers = await AsyncStorage.getItem('drivers');
                if (!storedDrivers) {
                    await AsyncStorage.setItem('drivers', JSON.stringify(drivers));
                    storedDrivers = JSON.stringify(drivers);
                }

                // Parse the drivers and assign a random driver
                const parsedDrivers = JSON.parse(storedDrivers);
                const randomDriverIndex = Math.floor(Math.random() * parsedDrivers.length);
                setAssignedDriver(parsedDrivers[randomDriverIndex]);

            } catch (error) {
                console.error('Failed to store or retrieve drivers:', error);
            }
        };

        storeAndAssignDriver();
    }, []);

    // calculate estimated delivery time
    useEffect(() => {
        const first = 10; // first order need to wait 10 mins
        const ordersInQueue = 3;
        const totalTime = first + ordersInQueue * 5; // add 5 mins per order
        const orderTime = new Date();
        orderTime.setMinutes(orderTime.getMinutes() + totalTime);
        setDeliveryTime(orderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); // Print Time
    }, []);

    // Fetch the address based on orderId
    useEffect(() => {
        const fetchAddress = async () => {
            const addr = await loadAddress(orderId);
            setAddress(addr);
        };
        fetchAddress();
    }, [orderId]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.upperPart}>
                <Text style={styles.delivery}>Estimated Delivery Time:</Text>
                <Text style={styles.order}>Order #{orderId}</Text>
            </View>
            <Text style={styles.time}>{DeliveryTime}</Text>

            {/* Delivery Process Tracking */}
            <View style={styles.outerbox}>
                <View style={{ flex: 1 }}>
                    {processes.map(process => (
                        <View key={process.ID}>
                            <View style={styles.trackbarDistance}>
                                <Text style={styles.circle}>◯</Text>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.line2}>│</Text>
                                <View style={styles.overall}>
                                    <View style={styles.iconInside}>
                                        <MaterialCommunityIcons
                                            name={process.buttonIcon}
                                            size={24}
                                            color={progress >= process.ID ? 'green' : 'gray'}
                                            style={styles.wordDistance}
                                        />

                                        <View style={styles.textBlock}>
                                            <Text style={[styles.TitleInside, progress >= process.ID && styles.active]}>{process.title}</Text>
                                            <Text style={[styles.DescriptionInside, progress >= process.ID && styles.active]}>{process.description}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

                  <View style={{ margin: 10 }}>
            
            {/* Display Assigned Driver Details */}
            <Text style={styles.bigTitle}>Delivered By:</Text>
            <View style={styles.driverIcon}>
                <View style={styles.driverAlign}>
                    <MaterialCommunityIcons name="account-circle" size={40} color="#939DA9" />
                    <View style={styles.driverDistance}>
                        {assignedDriver ? (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ marginTop: 5 }}>
                                    <Text style={styles.DriverLabel}>Assigned Driver:</Text>
                                    <Text style={styles.driverOverall}>{assignedDriver.name}</Text>
                                    <Text style={styles.driverOverall}>Plate: {assignedDriver.plate}</Text>
                                </View>
                                <View style={styles.iconAlign}>
                                    <TouchableOpacity onPress={() => navigation.navigate('Call', { phone: assignedDriver.phone })}>
                                        <MaterialCommunityIcons name="phone-in-talk-outline" size={24} color="green" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate('Message', { driverName: assignedDriver.name, userName: name })} style={{ marginLeft: 10 }}>
                                        <MaterialCommunityIcons name="chat-processing-outline" size={24} color="green" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <Text>Loading driver...</Text>
                        )}
                    </View>
                </View>
            </View>
            

            {/* Display Delivery Address */}
            <Text style={[styles.bigTitle, { marginTop: 20 }]}>Delivery Address:</Text>
            <View style={styles.deliveryAddressFormat}>
                <MaterialCommunityIcons name="map-marker" size={40} color="#939DA9" />
                <View style={styles.customer}>
                    <Text style={styles.customerName}>{name}</Text>
                    <Text style={styles.driverOverall}>{address}</Text>
                </View>
            </View>
            </View>
        </ScrollView>
    );
};

export default DeliveryScreen;

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
    delivery: {
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
    line2: {
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
    DriverLabel: { 
        fontWeight: "600",
        color: 'black',
        fontSize: 16,
        marginBottom: 4,
    },
    bigTitle: { 
        fontWeight: "bold",
        color: 'black',
        fontSize: 16,
        marginBottom: 4,
    },
    driverOverall: { 
        color: 'grey',
        fontSize: 14,
    },
    driverDistance: {
        marginLeft: 10,
        flexShrink: 1,
    },
    driverAlign: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    driverIcon: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    customer: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingLeft: 10,
        flexShrink: 1,
    },
    customerName: {
        fontWeight: "bold",
        color: 'black',
        fontSize: 16,
    },
    iconAlign: {
        alignItems: "center",
        flexWrap: "nowrap",
        gap: 10,
        marginLeft: 120
    },
    deliveryAddressFormat: {
        flexDirection: "row",
        alignItems: "flex-start",

    },
});

