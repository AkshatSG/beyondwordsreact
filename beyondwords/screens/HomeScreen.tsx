import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const buttonSize = width * 0.4;

export default function HomeScreen() {

    const navigation = useNavigation();

    const handleScanTextButtonPress = () => {        
        navigation.navigate('ImageCrop');
    }

    const circleButtonStyle = [styles.circleButton, {width: buttonSize, height: buttonSize}];

    return (
        <ImageBackground source={require('../assets/images/appbackground.jpeg')} style={styles.backgroundImage}>
            <View style={[styles.homeContainer]}>
                <TouchableOpacity style={circleButtonStyle} onPress={handleScanTextButtonPress}>
                    <Text style={styles.newText}>+</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    homeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    homeTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    text: {
        fontFamily: 'OpenDyslexic-Bold',
        margin: 10,
    },
    circleButton: {
        borderRadius: 100,
        backgroundColor: '#0072C6',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    newText: {
        fontFamily: 'OpenDyslexic-Bold',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10,
        textAlign: 'center',
        lineHeight: buttonSize,
        color: 'lightgray',
        fontSize: buttonSize * 0.8,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
});