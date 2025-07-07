import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import PagerView from 'react-native-pager-view';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = () => {

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.ImageContainer}>
          <PagerView style={styles.viewPager} initialPage={1}>
            <View key="0">
              <Image style={styles.bannerImage} source={require('../img/Matcha.jpg')} resizeMode="cover" />
            </View>
            <View key="1">
              <Image style={styles.bannerImage} source={require('../img/mineralwater.jpg')} resizeMode="cover" />
            </View>
            <View key="2">
              <Image style={styles.bannerImage} source={require('../img/tealeave.jpg')} resizeMode="cover" />
            </View>
            <View key="3">
              <Image style={styles.bannerImage} source={require('../img/strawberry.jpg')} resizeMode="cover" />
            </View>
          </PagerView>
        </View>

        <View>
          <View>
            <Text style={styles.sectionTitle}>FEATURE</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.ImageRow}>
            <View style={styles.imageWrapper}>
              <Image style={styles.featureImage} source={require('../img/milkTea.jpg')} />
            </View>
            <Image style={styles.featureImage} source={require('../img/fruitTea.jpeg')} />
            <Image style={styles.featureImage} source={require('../img/smoothie.jpg')} />
          </ScrollView>
        </View>

        {/* shop introduction */}
        <View>
          <Text style={styles.sectionTitle}>ABOUT US</Text>
          <View style={styles.aboutContainer}>
            <Text style={styles.detailText}> Originator of New Style Tea </Text>
            <Text style={styles.smalldetailText}>Revitalizing the ancient tea with a refrshing modern twist since 2023</Text>
          </View>
        </View>
      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  menuButton: {
    marginLeft: 10,
  },
  ImageContainer: {
    width: screenWidth - 50,
    height: 200,
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 20,
  },
  imagePlace: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewPager: {
    flex: 1,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  ImageRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginBottom: 20,
  },
  featureImage: {
    width: 120,
    height: 150,
    borderRadius: 15,
    marginRight: 15,
    backgroundColor: '#ccc',
    overflow: 'hidden',
  },
  aboutContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    backgroundColor: '#fffaf0',
  },
  detailText: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold'
  },
  smalldetailText: {
    fontSize: 14
  },
  bottomTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 0.5,
    borderColor: '#ccc',
    paddingVertical: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  imageWrapper: {
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 15,
  },
});

export default HomeScreen;
