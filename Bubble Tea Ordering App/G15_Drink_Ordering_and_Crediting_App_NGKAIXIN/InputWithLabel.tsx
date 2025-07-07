import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const InputWithLabel = ( props: any ) => {

  const orientationDirection = (props.orientation == 'horizontal') ? 'row': 'column';

  return (
    <View style={[inputStyles.container, {flexDirection: orientationDirection}]}>
        <Text style={inputStyles.label}>{props.label}</Text>
        <TextInput
          style={[inputStyles.input, props.style]}
          {...props}
        />
      </View>
    );
}

const inputStyles = StyleSheet.create({
  container: {
    height: 100,
    // backgroundColor: 'lightblue',
  },
  label: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 3,
    textAlignVertical: 'center',
  },
  input: {
    flex: 3,
    // right:20,
    fontSize: 20,
    color: 'blue',
  },
});

export default InputWithLabel;