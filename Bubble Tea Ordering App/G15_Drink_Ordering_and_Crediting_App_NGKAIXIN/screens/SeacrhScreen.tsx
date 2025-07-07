import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { getDB, searchDrinks } from '../db-service';
import { TouchableOpacity } from 'react-native';
import { AppContext } from '../AppContext';

const SeacrhScreen = ({ route, navigation }: any) => {

  const { drinks } = useContext(AppContext);
  const { user_id } = route.params;

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [bubbleTeaData, setBubbleTeaData] = useState([]);
  const [bubbleTeaCategories, setBubbleTeaCategories] = useState([]);

  const loadData = async () => {
    const db = await getDB();

    // Fetch drinks with specific IDs
    const drinkIds = [1, 5, 7, 10, 13, 15];

    const mergeDrinksByIds = (drinkIds: any, contextDrinks: any) => {
      const merged = drinkIds.map((id: any) => {
        const drink = contextDrinks.find((d: any) => d.id === id);
        if (!drink) {
          console.warn(`Drink with ID ${id} not found in context`);
          return null;
        }
        return drink;
      }).filter(Boolean); // removes any nulls
      return merged;
    };

    const mergedDrinks = mergeDrinksByIds(drinkIds, drinks);
    setBubbleTeaData(mergedDrinks);

    const categoryImages = [
      require('../img/milkTea.jpg'),
      require('../img/fruitTea.jpeg'),
      require('../img/smoothie.jpg'),
    ];

    // Get unique categories
    const uniqueCategories = [...new Set(drinks.map((item: any) => item.category))];
    const formattedCategories: any = uniqueCategories.map((cat, index) => ({
      name: cat,
      image: categoryImages[index % categoryImages.length],
    }));

    setBubbleTeaCategories(formattedCategories);
  };

  useEffect(() => {
    loadData();
  }, []);

  // render the recommendation drinks items
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('DrinksDetails', {
        drinkId: item.id,
        userId: user_id,
      })}
      style={styles.card}
    >
      <Image source={item.image} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.title}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  // categories of drinks
  const renderCategory = ({ item }: any) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
      </View>
    </View>
  );

  // merge the search result to add image
  const mapSearchResultsToDrinks = (searchResults: any[], allDrinks: any[]) => {
    return searchResults
      .map((result) => allDrinks.find((drink) => drink.id === result.id))
      .filter(Boolean); // remove nulls in case of missing matches
  };

  // search drinks based on keyword
  const search = async () => {
    if (searchKeyword.trim() !== '') {
      const rawResults = await searchDrinks(await getDB(), searchKeyword);

      // Map raw results to full drink objects from context
      const mappedResults = mapSearchResultsToDrinks(rawResults, drinks);

      setSearchResults(mappedResults);
      setHasSearched(true);  // mark search as done
    } else {
      setHasSearched(false);  // reset search status if input is empty
    }
  };

  return (
    <View style={{ backgroundColor: '#fff', paddingBottom: 50 }}>
      <FlatList style={{ margin: 12 }}
        ListHeaderComponent={
          <>
          {/** Search bar to search drinks */}
            <Searchbar
              placeholder="Search"
              onChangeText={setSearchKeyword}
              value={searchKeyword}
              onIconPress={search}
              onSubmitEditing={search}
            />

            {/** display the recommendation for user */}
            {!hasSearched && (
              <>
                <View style={styles.itemBox}>
                  <Text style={styles.title}>Recommended for you</Text>
                  <FlatList
                    data={bubbleTeaData}
                    renderItem={renderItem}
                    numColumns={2}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false} // important!
                  />
                </View>

                <View style={styles.itemBox}>
                  <Text style={styles.title}>Shop by categories</Text>
                  <FlatList
                    data={bubbleTeaCategories}
                    renderItem={renderCategory}
                    numColumns={2}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled={false} // important!
                  />
                </View>
              </>
            )}

            {/** display the search result */}
            {hasSearched && (
              <Text style={styles.title}>Search Results</Text>
            )}
          </>
        }
        data={hasSearched ? searchResults : []}
        keyExtractor={(item, index) =>
          hasSearched ? item.id.toString() : index.toString()
        }
        renderItem={
          hasSearched
            ? ({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('DrinksDetails', {
                  drinkId: item.id,
                  userId: user_id,
                })}
                style={{
                  marginBottom: 10,
                  padding: 10,
                  backgroundColor: '#f0f0f0',
                  borderRadius: 12,
                }}
              >
                <View style={{ flexDirection: 'row', marginBottom: 10, backgroundColor: '#f0f0f0', borderRadius: 12, margin: 8 }}>
                  <Image source={item.image} style={styles.searchImage} />
                  <View style={{ marginLeft: 20, marginRight: 12 }}>
                    <Text style={styles.name}>{item.title}</Text>
                    <Text>Category: {item.category}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      <Text numberOfLines={2} style={{ flexShrink: 1 }}>Description: {item.description}</Text>
                    </View>
                    <Text>Price: {item.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>

            )
            : null
        }
        // if the nothing is found 
        ListEmptyComponent={
          hasSearched ? (
            <Text style={{ margin: 10, color: '#888', fontSize: 15 }}>
              No results found.
            </Text>
          ) : null
        }
      />
    </View>

  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  itemBox: {
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
    marginBottom: 10,
  },
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '48%'
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginBottom: 8,
    alignSelf: 'center',
  },
  searchImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
    alignSelf: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  details: {
    flexDirection: 'column',
    alignSelf: 'center',
    marginLeft: 10,
    width: '65%',
  },
});

export default SeacrhScreen;
