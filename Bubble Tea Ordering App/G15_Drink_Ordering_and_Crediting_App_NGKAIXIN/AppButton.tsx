import React, { Component } from 'react';
import {
    Platform,
    View,
    Text,
    TouchableNativeFeedback,
    StyleSheet,
} from 'react-native';

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

const buttonStyles = StyleSheet.create({
    button: {
        margin: 5,
        alignItems: 'center',
    },
    buttonText: {
        padding: 20,
        fontSize: 20,
        color: 'white'
    },
});

export default AppButton;