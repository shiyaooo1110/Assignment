import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import { AppContext } from "../AppContext";

const MenuScreen = ({ navigation, route }: any) => {

  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const { drinks } = useContext(AppContext);
  const { user_id }: any = route.params;

  // filter drinks by category
  const categories = ['All', ...new Set(drinks.map((drink: any) => drink.category))];
  const filteredDrinks = selectedCategory === 'All' ? drinks : drinks.filter((drink: any) => drink.category === selectedCategory);

  // formatted the drink item
  const renderDrinkItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.drinkCard}
      onPress={() => {
        navigation.navigate('DrinksDetails',{
          drinkId:item.id,
          userId: user_id,
        })
        console.log('Open drink: ', item.id)
      }}>
      <Image source={item.image} style={styles.drinkImage} />
      <Text style={styles.drinkName}>{item.title}</Text>
      <Text style={styles.drinkPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, paddingBottom: 40 }}>
      <View style={styles.container}>
        {/** header part */}
        <Image style={styles.bannerPicStlyes}
          source={require('../img/background.png')} />

        {/** Category */}
        <View style={styles.categoryScroll}>
          {categories.map((cat: any) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryButton,
                selectedCategory === cat && { backgroundColor: '#7a5835' }
              ]}>
              <Text style={[
                styles.categoryText,
                selectedCategory === cat && { color: 'white', fontWeight: 'bold' }
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/** list all the items in the selected category */}
        <FlatList
          style={styles.drinkList}
          data={filteredDrinks}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={renderDrinkItem}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: 'flex-start' }}
        />
      </View>
    </View>
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
    backgroundColor: '#fff',
  },
  categoryScroll: {
    maxHeight: 50,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
    flexDirection: 'row'
  },
  categoryButton: {
    marginRight: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#fff',
    height: 40
  },
  categoryText: {
    fontSize: 16,
    fontWeight:'bold',
    color: '#56585c',
    // fontFamily: 'IntroRust-Base.otf'
  },
  selectedCategory: {
    backgroundColor: '#d4a373',
    color: 'black',
    fontWeight: 'bold'
  },
  drinkList: {
    paddingHorizontal: 10,
    marginBottom:30
  },
  drinkCard: {
    width: '47%',
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    padding: 10, 
  },
  drinkImage: {
    width: 100,
    height: 100,
    borderRadius: 10
  },
  drinkName: {
    // fontFamily:'SegoeUI.ttf', 
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5e4216'
  },
  drinkPrice: {
    // fontFamily:'SegoeUI.ttf', 
    marginTop: 3,
    fontSize: 14,
    fontWeight: '600',
    color: '#614820'
  },
  bannerPicStlyes: {
    width: '100%',
    height: 200,
    resizeMode: 'cover'
  }
});

export default MenuScreen;
