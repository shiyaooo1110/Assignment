import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, Alert} from "react-native";
import { AppContext } from "../AppContext";

let config = require('../Config');

const DrinksDetailsScreen = ({ route, navigation }: any ) => {

    const { setOrderId, drinks } = useContext(AppContext);
    const { drinkId, userId } = route.params;
    const drink = drinks.find((d:any) => d.id === drinkId);
    
    // Arrays defining the options for size, ice level, sugar level, and toppings
    const size =[{id: 1, title: 'Medium', price: 0},
                 {id: 2, title: 'Large', price: 2.00}]

    const iceLevel =[{id: 1, title: 'Less Ice', price: 'FREE'},
                     {id: 2, title:'Normal Ice', price: 'FREE'}]

    const SugarLevel =[{id: 1, title: 'No Added Sugar', price: 'FREE'},
                       {id: 2, title: 'Less Sugar (30%)', price: 'FREE'},
                       {id: 3, title: 'Half Sugar (50%)', price: 'FREE'},
                       {id: 4, title: 'Slight Sugar (70%)', price: 'FREE'},
                       {id: 5, title: 'Normal Sugar (100%)', price: 'FREE'}]

    const toppings=[{id:1, title: 'Aloe Vera', price:'1.50'},
                    {id:2, title: 'Boba (Pearl)', price:'1.50'},
                    {id:3, title: 'Chia Seed', price:'1.50'},
                    {id:4, title: 'Caramel Cookie Crumbs', price:'1.50'},
                    {id:5, title: 'Grass Jelly', price:'1.50'},
                    {id:6, title: 'Pudding', price:'1.50'}]

    // State variables for selected options and total price
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedIce, setSelectedIce] = useState('');
    const [selectedSugar, setSelectedSugar] = useState('');
    const [selectedToppings, setSelectedToppings] = useState('');
    const [totalPrice, setTotalPrice] = useState(() => {
        const base = parseFloat(drink.price?.replace(/[^0-9.]/g, '') || '0');
        return base;
    });    
    const [quantity, setQuantity] = useState(1);    

    const handleSizeSelect = (item: any) => {
        setSelectedSize(item.id.toString());

        const sizePrice = item.price;
        const basePrice = parseFloat(drink.price?.replace(/[^0-9.]/g, '') || '0');
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
        const basePrice = parseFloat(drink.price.replace(/[^0-9.]/g, '')) || 0;
        const selectedSizeItem = size.find(s => s.id.toString() === selectedSize);
        const sizePrice = selectedSizeItem ? selectedSizeItem.price : 0;
        const selectedToppingItems = toppings.filter(t => selectedToppings.includes(t.id.toString()));

        const toppingPrice = selectedToppingItems.reduce((acc, curr) => {
            return acc + (parseFloat(curr.price) || 0);
        }, 0);

        const qty = Number(quantity) > 0 ? Number(quantity) : 1;
        const total = (basePrice + sizePrice + toppingPrice) * qty;
        return total;
    }; 

    // save the customized drink of customer
    const _save = () => {

        const selectedSizeItem = size.find(item => item.id.toString() === selectedSize);
        const selectedIceItem = iceLevel.find(item => item.id.toString() === selectedIce);
        const selectedSugarItem = SugarLevel.find(item => item.id.toString() === selectedSugar);
        const selectedToppingItem = toppings.find(item => item.id.toString() === selectedToppings);
    
        let url = config.settings.serverPath + '/api/orders';
    
        fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            items: [
              {
                drink_id: drink.id,
                name: drink.title,
                size: selectedSizeItem?.title || '',
                quantity: quantity,
                drink_price: drink.price,
                toppings: selectedToppingItem?.title || '',
                ice_level: selectedIceItem?.title || '',
                sugar_level: selectedSugarItem?.title || ''
              }
            ]
          }),
          
        })
          .then(response => {
            // console.log('RAW RESPONSE:', response);
            if (!response.ok) {
              Alert.alert('Error:', response.status.toString());
              throw Error('Error ' + response.status);
            }
            return response.json();
          })
          .then(respondJson => {
            console.log(respondJson);
            if (respondJson.affected > 0) {
              Alert.alert('Record SAVED for', drink.title);
              
            } else {
              Alert.alert('Error in SAVING');
            }
            // console.log('MESSAGE:', JSON.stringify(respondJson.message));
            setOrderId(respondJson.order_id);
            Alert.alert('Success', 'Drink added to cart!');
            navigation.goBack();
          })
          .catch(error => {
            console.log(error);
          });
      }

    // Update the total price
    useEffect(() => {
        const updatedTotal = calculateTotalPrice();
        setTotalPrice(updatedTotal);
        navigation.setOptions({headerTitle: 'Add Drinks'});
    }, [selectedSize, selectedToppings, quantity]);

    return (
     <ScrollView style = {{backgroundColor:'#ffffff'}} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:45}}>
        <View>
            {/* Drink image and description */}
            <View style={styles.banner}>
                <Image source={drink.image} style={styles.image}/>
                <Text style={styles.title}>{drink.title}</Text>
                <Text style={styles.description}>{drink.description}</Text>
            </View>
            
            <View style={styles.container}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline'}}>
                    <Text style={{fontSize: 16,fontWeight: 'bold',marginLeft: 10,marginTop: 10,color: '#000'}}>Base Price</Text>
                    <Text style={{fontSize: 22,fontWeight: 'bold',paddingRight: 5, color:'#000'}}>{drink.price}</Text>
                </View>

                {/* Size options */}
                <View style={{borderBottomWidth:0.8, borderBottomColor:'#bdb3a8', paddingBottom:15}}>
                    <Text style={styles.label}>Size</Text>
                    <View style={styles.buttonContainer}>
                        {size.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.button, 
                                {backgroundColor: selectedSize === item.id.toString() ? '#ebd4b0' : 'white',
                                borderWidth: selectedSize === item.id.toString() ? 1.2 : 1,
                                borderColor: selectedSize === item.id.toString() ? '#807059':'#ab9c87'}]}
                            onPress={() => handleSizeSelect(item)}
                        >
                            <Text style={[styles.buttonText,{fontWeight: selectedSize === item.id.toString() ? 'bold' : 'normal'}]}>
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
            <View style={{borderBottomWidth:0.8, borderBottomColor:'#bdb3a8', paddingBottom:15}}>
                <Text style={styles.label}>Ice Level</Text>
                <View style={styles.buttonContainer}>
                    {iceLevel.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.button,
                            {backgroundColor: selectedIce === item.id.toString() ? '#ebd4b0' : '#fff',
                            borderWidth: selectedIce === item.id.toString() ? 1.2 : 1,
                            borderColor: selectedIce === item.id.toString() ? '#807059':'#ab9c87'}]}
                        onPress={() => setSelectedIce(item.id.toString())}
                    >
                        <Text style={[styles.buttonText,{fontWeight: selectedIce === item.id.toString() ? 'bold' : 'normal'}]}>
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
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline'}}>
                    <Text style={styles.label}>Add-On Toppings</Text>
                    <Text style={{fontSize:16,marginRight:10, textAlign:'right',paddingTop:5}}>Optional, max 1 </Text>
                </View>                    
                {toppings.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.OptionLabel}
                        onPress={() => setSelectedToppings(item.id.toString())}>
                        <View style={styles.radioCircle}>
                            {selectedToppings.includes(item.id.toString()) && (<View style={styles.selectedDot} />)}
                        </View>
                        <View style={styles.radioTextContainer}>
                            <Text
                                style={[
                                styles.radioLabel,
                                selectedToppings.includes(item.id.toString()) && {fontWeight: 'bold',color: '#6b6759'}]}
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
                onPress={()=> {
                    if (!selectedSize){
                        Alert.alert("Please select a size.")
                    } else if(!selectedIce) {
                        Alert.alert("Please select an ice level.")
                    } else if(!selectedSugar){
                        Alert.alert("Please select a sugar level.")
                    } else {
                        _save();
                    }
                }}>
                    <Text style={styles.cartButtonText}>
                     Add to Cart - RM {totalPrice.toFixed(2)}
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
     </ScrollView>
    );
}

const styles = StyleSheet.create({
    topBanner:{
        backgroundColor:'#ffffff', 
        width:"auto", 
        height:45, 
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center', 
        padding:5
    },
    container:{ 
        flex: 1, 
        borderBottomWidth: 0.8,
        borderBottomColor:'#bdb3a8',
        margin: 5
    },
    banner:{
        backgroundColor: '#ffffff',
        paddingTop: 25,
        paddingBottom: 5,
        alignItems:'center',
        justifyContent:'center',
        flex: 1,
        borderBottomWidth: 0.8,
        borderBottomColor:'#bdb3a8'
    },    
    title:{ 
        marginTop: 10, 
        fontSize: 24, 
        fontWeight: 'bold', 
        color:'#7a5835',
        flexDirection:'column'
    },
    image:{ 
        width: 200, 
        height: 200, 
        backgroundColor:'#ffffff',
        borderRadius:10 
    },
    price:{ 
        fontSize: 20, 
        color: '#6b6759', 
        marginBottom: 10 ,
        flexDirection: 'column'
    },
    description:{ 
        fontSize: 16, 
        textAlign: 'center', 
        color: '#595143',
        paddingBottom: 8,
        paddingLeft: 5,
        paddingRight: 8,
        fontFamily: 'NotoSansSC-VF' 
    },
    label:{
        fontSize: 20,
        fontWeight: 'bold', 
        marginLeft: 10, 
        paddingBottom:5, 
        paddingTop:5,
        textAlign:'left',
        color:'#7a5835',
        fontFamily:'segoeui'
    },    
    buttonContainer:{
        flexDirection: 'row', 
        justifyContent:'space-between', 
        marginHorizontal: 5, 
        margin:5 },
    button:{
        borderRadius: 20,
        paddingVertical: 5,
        width: '48%',
        minHeight: 40
    },
    buttonText:{
        color: 'black',
        fontSize: 16,
        textAlign: 'center'
    },
    OptionLabel:{
        fontFamily:'NotoSansSC-VF',
        fontSize: 20,
        fontWeight: '100',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        marginLeft: 10,
        paddingBottom:5,
        color:'#45392b'
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
        paddingLeft:10
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
        marginTop:10,
        marginBottom:5
    },      
    quantityButton: {
        backgroundColor: 'black',
        paddingHorizontal: 15,
        paddingVertical: 6,
        width:40,
        height:40,
        borderRadius: 20,
        marginHorizontal: 30
    },      
    quantityButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf:'center',
        alignContent:'center'
    },      
    quantityText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black'
    },
    cartButtonContainer: {
        margin: 15,
        marginTop:8,
        alignItems: 'center'
    },      
    cartButton: {
        backgroundColor: 'black',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 15,
        width: '100%',
        alignItems: 'center'
    },      
    cartButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily:'segoeui'
    }   
      
  });  

export default DrinksDetailsScreen;