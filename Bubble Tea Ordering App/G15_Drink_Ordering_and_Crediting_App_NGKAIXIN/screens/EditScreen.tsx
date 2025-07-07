import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from "react-native";
import { AppContext } from "../AppContext";
import type { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from "../Types";

export type Props = StackScreenProps<RootStackParamList, 'Edit'>;

let config = require('../Config');

const EditScreen = ({ route, navigation }: Props) => {

    const { drinks } = useContext(AppContext);
    const { order_id, drink_id } = route.params;

    const [drink, setDrink]: any = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Arrays defining the options for size, ice level, sugar level, and toppings
    const size = [{ id: 1, title: 'Medium', price: 0 },
                  { id: 2, title: 'Large', price: 2.00 }]

    const iceLevel = [{ id: 1, title: 'Less Ice', price: 'FREE' },
                      { id: 2, title: 'Normal Ice', price: 'FREE' }]

    const SugarLevel = [{ id: 1, title: 'No Added Sugar', price: 'FREE' },
                        { id: 2, title: 'Less Sugar (30%)', price: 'FREE' },
                        { id: 3, title: 'Half Sugar (50%)', price: 'FREE' },
                        { id: 4, title: 'Slight Sugar (70%)', price: 'FREE' },
                        { id: 5, title: 'Normal Sugar (100%)', price: 'FREE' }]

    const toppings = [{ id: 1, title: 'Aloe Vera', price: '1.50' },
                      { id: 2, title: 'Boba (Pearl)', price: '1.50' },
                      { id: 3, title: 'Chia Seed', price: '1.50' },
                      { id: 4, title: 'Caramel Cookie Crumbs', price: '1.50' },
                      { id: 5, title: 'Grass Jelly', price: '1.50' },
                      { id: 6, title: 'Pudding', price: '1.50' }]

    // State variables for selected options and total price
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedIce, setSelectedIce] = useState('');
    const [selectedSugar, setSelectedSugar] = useState('');
    const [selectedToppings, setSelectedToppings] = useState('');
    const [quantity, setQuantity] = useState(1);

    const [totalPrice, setTotalPrice] = useState(0);

    const handleSizeSelect = (item: any) => {
        setSelectedSize(item.id.toString());

        const sizePrice = item.price;
        const basePrice = parseFloat(drink.drink_price.replace(/[^0-9.]/g, '')) || 0;
        const newTotal = basePrice + sizePrice;

        setTotalPrice(newTotal);
    };

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    };

    const calculateTotalPrice = () => {
        const basePrice = parseFloat(drink.drink_price.replace(/[^0-9.]/g, '')) || 0;
        const selectedSizeItem = size.find(s => s.id.toString() === selectedSize);
        const sizePrice = selectedSizeItem ? selectedSizeItem.price : 0;
        const selectedToppingItem = toppings.find(t => t.id.toString() === selectedToppings);
        const toppingPrice = selectedToppingItem ? parseFloat(selectedToppingItem.price) : 0;

        const qty = Number(quantity) > 0 ? Number(quantity) : 1;
        const total = (basePrice + sizePrice + toppingPrice) * qty;
        return total;
    };

    // fetch the order items by order_id and drink_id
    const _fetch_order_item = () => {
        let url = config.settings.serverPath + `/api/order_items/order/${order_id}/drink/${drink_id}`;
        console.log('url: ' + url);
        setIsLoading(true);
        console.log('Loading? : ' + isLoading);

        fetch(url)
            .then(response => {
                console.log(response);
                if (!response.ok) {
                    Alert.alert('Error:', response.status.toString());
                    throw Error('Error ' + response.status);
                }
                return response.json();
            })
            .then(drink => {
                console.log('Fetched drink raw:', drink);
                if (!drink) {
                    console.warn('No drink data returned from API');
                    return;
                }
                const mergedDrink = mergeDrinkImage(drink, drinks);
                setDrink(mergedDrink);

                console.log('Final merged drink:', mergedDrink);
            })

            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false); 
            });
    }

    // combine drink with image
    const mergeDrinkImage = (drink: any, contextDrinks: any) => {
        if (!drink) {
            console.warn('mergeDrinkImage called with null drink');
            return null;
        }

        console.log('Context drinks:', contextDrinks);
        const match = contextDrinks.find((ctxItem: any) => ctxItem.id === drink_id);
        console.log('Match drink:', match);

        return {
            ...drink,
            image: match ? match.image : require('../img/brownsugar.jpg'),
        };
    };

    useEffect(() => {
        _fetch_order_item();
        navigation.setOptions({ headerTitle: 'Edit Drink' });

    }, []);

    // edit the order_items
    const _edit = () => {
        const selectedSizeItem = size.find(item => item.id.toString() === selectedSize);
        const selectedIceItem = iceLevel.find(item => item.id.toString() === selectedIce);
        const selectedSugarItem = SugarLevel.find(item => item.id.toString() === selectedSugar);
        const selectedToppingItem = toppings.find(item => item.id.toString() === selectedToppings);

        let url = config.settings.serverPath + '/api/order_items/order/' + order_id + '/drink/' + drink_id;

        fetch(url, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                drink_id: drink.id,
                name: drink.name,
                size: selectedSizeItem?.title || '',
                quantity: quantity,
                drink_price: drink.drink_price,
                toppings: selectedToppingItem?.title || '',
                ice_level: selectedIceItem?.title || '',
                sugar_level: selectedSugarItem?.title || ''
            }),
        })
            .then(response => {
                console.log(response);
                if (!response.ok) {
                    Alert.alert('Error:', response.status.toString());
                    throw Error('Error ' + response.status);
                }

                return response.json();
            })
            .then(respondJson => {
                if (respondJson.affected > 0) {
                    Alert.alert('Success', 'Your drink has been updated.');
                } else {
                    Alert.alert('Error in UPDATING');
                }
                navigation.goBack();
            })
            .catch(error => {
                console.log(error);
            })

    }

    useEffect(() => {
        if (drink) {
            const updatedTotal = calculateTotalPrice();
            setTotalPrice(updatedTotal);
        }
    }, [selectedSize, selectedToppings, quantity]);

    // set the previous selection of user
    useEffect(() => {
        if (drink) {
            const sizeItem = size.find(item => item.title === drink.size);
            const iceItem = iceLevel.find(item => item.title === drink.ice_level);
            const sugarItem = SugarLevel.find(item => item.title === drink.sugar_level);
            const toppingItem = toppings.find(item => item.title === drink.toppings);

            setSelectedSize(sizeItem ? sizeItem.id.toString() : '');
            setSelectedIce(iceItem ? iceItem.id.toString() : '');
            setSelectedSugar(sugarItem ? sugarItem.id.toString() : '');
            setSelectedToppings(toppingItem ? toppingItem.id.toString() : '');
            setQuantity(drink.quantity || 1);
        }
    }, [drink]);

    if (isLoading || !drink) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#7a5835" />
            </View>
        );
    }

    return (
        <ScrollView style={{ backgroundColor: '#ffffff' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 45 }}>
            <View>
                {/* Drink image and description */}
                <View style={styles.banner}>
                    <Image source={drink.image} style={styles.image} />
                    <Text style={styles.title}>{drink.name}</Text>
                </View>

                <View style={styles.container}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 10, marginTop: 10, color: '#000' }}>Base Price</Text>
                        <Text style={{ fontSize: 22, fontWeight: 'bold', paddingRight: 5, color: '#000' }}>{drink.drink_price}</Text>
                    </View>

                    {/* Size options */}
                    <View style={{ borderBottomWidth: 0.8, borderBottomColor: '#bdb3a8', paddingBottom: 15 }}>
                        <Text style={styles.label}>Size</Text>
                        <View style={styles.buttonContainer}>
                            {size.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[styles.button,
                                    {
                                        backgroundColor: selectedSize === item.id.toString() ? '#ebd4b0' : '#ffffff',
                                        borderWidth: selectedSize === item.id.toString() ? 1.2 : 1,
                                        borderColor: selectedSize === item.id.toString() ? '#807059' : '#ab9c87'
                                    }]}
                                    onPress={() => handleSizeSelect(item)}
                                >
                                    <Text style={[styles.buttonText, { fontWeight: selectedSize === item.id.toString() ? 'bold' : 'normal' }]}>
                                        {item.title}
                                    </Text>
                                    <Text style={{ fontSize: 14, color: '#807262', textAlign: 'center' }}>
                                        {item.price === 0 ? 'FREE' : `+ RM ${item.price.toFixed(2)}`}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Ice level options */}
                <View style={{ borderBottomWidth: 0.8, borderBottomColor: '#bdb3a8', paddingBottom: 15 }}>
                    <Text style={styles.label}>Ice Level</Text>
                    <View style={styles.buttonContainer}>
                        {iceLevel.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.button,
                                {
                                    backgroundColor: selectedIce === item.id.toString() ? '#ebd4b0' : '#ffffff',
                                    borderWidth: selectedIce === item.id.toString() ? 1.2 : 1,
                                    borderColor: selectedIce === item.id.toString() ? '#807059' : '#ab9c87'
                                }]}
                                onPress={() => setSelectedIce(item.id.toString())}
                            >
                                <Text style={[styles.buttonText, { fontWeight: selectedIce === item.id.toString() ? 'bold' : 'normal' }]}>
                                    {item.title}
                                </Text>
                                <Text style={{ fontSize: 14, color: '#807262', textAlign: 'center' }}>
                                    {item.price}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Sugar level options */}
                <View style={styles.container}>
                    <Text style={styles.label}>Sugar Level</Text>
                    {SugarLevel.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.OptionLabel}
                            onPress={() => setSelectedSugar(item.id.toString())}
                        >
                            <View style={styles.radioCircle}>
                                {selectedSugar === item.id.toString() && <View style={styles.selectedDot} />}
                            </View>
                            <View style={styles.radioTextContainer}>
                                <Text
                                    style={[
                                        styles.radioLabel,
                                        selectedSugar === item.id.toString() && { fontWeight: 'bold', color: '#6b6759' }]}
                                >
                                    {item.title}
                                </Text>
                                {item.price && (<Text style={styles.itemPrice}> {item.price}</Text>)}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Topping options */}
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <Text style={styles.label}>Add-On Toppings</Text>
                        <Text style={{ fontSize: 16, marginRight: 10, textAlign: 'right', paddingTop: 5 }}>Optional, max 1 </Text>
                    </View>
                    {toppings.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.OptionLabel}
                            onPress={() => setSelectedToppings(item.id.toString())}
                        >
                            <View style={styles.radioCircle}>
                                {selectedToppings === item.id.toString() && (
                                    <View style={styles.selectedDot} />
                                )}
                            </View>
                            <View style={styles.radioTextContainer}>
                                <Text
                                    style={[
                                        styles.radioLabel,
                                        selectedToppings === item.id.toString() && {
                                            fontWeight: 'bold',
                                            color: '#6b6759',
                                        },
                                    ]}
                                >
                                    {item.title}
                                </Text>
                                <Text style={styles.itemPrice}>+ RM {item.price}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Quantity selection */}
                <View style={styles.quantityContainer}>
                    <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
                        <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>

                    <TextInput
                        style={styles.quantityText}
                        keyboardType="numeric"
                        value={quantity.toString()}
                        onChangeText={(text) => {
                            const num = parseInt(text);
                            if (!isNaN(num) && num >= 0) {
                                setQuantity(num);
                            } else if (text === '') {
                                setQuantity(0);
                            }
                        }}
                        maxLength={3}
                    />
                    <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>

                {/* Add to Cart button */}
                <View style={styles.cartButtonContainer}>
                    <TouchableOpacity style={styles.cartButton}
                        onPress={() => {
                            if (!selectedSize) {
                                Alert.alert("Please select a size.")
                            } else if (!selectedIce) {
                                Alert.alert("Please select an ice level.")
                            } else if (!selectedSugar) {
                                Alert.alert("Please select a sugar level.")
                            } else {
                                _edit();
                            }
                        }}>
                        <Text style={styles.cartButtonText}>
                            Update to Cart - RM {totalPrice.toFixed(2)}
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    topBanner: {
        backgroundColor: '#d6b390',
        width: "auto",
        height: 45,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5
    },
    container: {
        flex: 1,
        borderBottomWidth: 0.8,
        borderBottomColor: '#bdb3a8',
        margin: 5
    },
    banner: {
        backgroundColor: '#ffffff',
        paddingTop: 25,
        paddingBottom: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        borderBottomWidth: 0.8,
        borderBottomColor: '#bdb3a8'
    },
    title: {
        marginTop: 10,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#7a5835',
        flexDirection: 'column'
    },
    image: {
        width: 200,
        height: 200,
        backgroundColor: '#ffffff',
        borderRadius: 10
    },
    price: {
        fontSize: 20,
        color: '#6b6759',
        marginBottom: 10,
        flexDirection: 'column'
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#595143',
        paddingBottom: 8,
        paddingLeft: 5,
        paddingRight: 8,
        fontFamily: 'NotoSansSC-VF'
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        paddingBottom: 5,
        paddingTop: 5,
        textAlign: 'left',
        color: '#7a5835',
        fontFamily: 'segoeui'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 5,
        margin: 5
    },
    button: {
        borderRadius: 20,
        paddingVertical: 5,
        width: '48%',
        minHeight: 40
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center'
    },
    OptionLabel: {
        fontFamily: 'NotoSansSC-VF',
        fontSize: 20,
        fontWeight: '100',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        marginLeft: 10,
        paddingBottom: 5,
        color: '#45392b'
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#7d684d',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    radioLabel: {
        fontSize: 16,
        color: 'black',
        paddingLeft: 10
    },
    selectedDot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#7d684d'
    },
    radioTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        paddingRight: 10
    },
    itemPrice: {
        fontSize: 16,
        color: '#6b6759',
        fontWeight: 'normal'
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 5
    },
    quantityButton: {
        backgroundColor: '#000',
        paddingHorizontal: 15,
        paddingVertical: 6,
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 30
    },
    quantityButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        alignContent: 'center'
    },
    quantityText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black'
    },
    cartButtonContainer: {
        margin: 15,
        marginTop: 8,
        alignItems: 'center'
    },
    cartButton: {
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 15,
        width: '100%',
        alignItems: 'center'
    },
    cartButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'segoeui'
    }

});

export default EditScreen;