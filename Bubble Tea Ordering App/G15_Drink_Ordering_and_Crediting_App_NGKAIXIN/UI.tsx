import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableNativeFeedback,
  StyleSheet,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

/**
 * InputWithLabel
 */
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

/**
 * AppButton
 */
const AppButton = ( props: any ) => {

  let backgroundColorTheme = '';

  if(props.theme) {
      switch(props.theme) {
          case 'success':
              backgroundColorTheme = '#449d44';
              break;
          case 'info':
              backgroundColorTheme = '#31b0d5';
              break;
          case 'warning':
              backgroundColorTheme = '#ec971f';
              break;
          case 'danger':
              backgroundColorTheme = '#c9302c';
              break;
          case 'primary':
              backgroundColorTheme = '#60717d';
              break;
          default:
              backgroundColorTheme = '#286090';
      }
  }
  else {
      backgroundColorTheme = '#286090';
  }

  return (
      <TouchableNativeFeedback
          onPress={props.onPress}
          onLongPress={props.onLongPress}
      >
          <View style={[buttonStyles.button, {backgroundColor: backgroundColorTheme}]}>
              <Text style={buttonStyles.buttonText}>{props.title}</Text>
          </View>
      </TouchableNativeFeedback>
  )
}

/**
 * PickerWithLabel
 */
const PickerWithLabel = ( props: any )  => {

    const orientationDirection = (props.orientation == 'horizontal') ? 'row': 'column';

    return (
    <View style={[inputStyles.container, {flexDirection: orientationDirection}]}>
        <Text style={inputStyles.label}>{props.label}</Text>
        <Picker 
            style={(props.orientation == 'horizontal') ? {flex:3} : ''}
            {...props}
        >
        {props.items.map( (item:any) => {
            return (
            <Picker.Item
                label={item.value}
                value={item.key}
                key={item.key}
                style={[inputStyles.input,{marginLeft:30}]}
            />
            );
        })}
        </Picker>
    </View>
    );
}

const buttonStyles = StyleSheet.create({
  button: {
    margin: 5,
    alignItems: 'center',
  },
  buttonText: {
    padding: 20,
    fontSize: 20,
    color: 'white',
  },
});

const inputStyles = StyleSheet.create({
  container: {
    height: 80,
    marginLeft: 5,
    marginRight:5,
    marginBottom: 10,
  },
  label: {    
    fontFamily:'IntroRust-Base',
    fontWeight:'bold',
    flex: 1,
    fontSize: 22,
    textAlignVertical: 'center',
    paddingLeft:5,
    marginBottom:5
  },
  input: {
    flex: 1,
    fontSize: 18,
    backgroundColor:'#e4e7ed',
    borderRadius:15,
    paddingLeft: 10,
  },
});

export {
  AppButton,
  InputWithLabel,
  PickerWithLabel
}