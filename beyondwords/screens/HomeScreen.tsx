import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { RNCamera } from 'react-native-camera';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import Tts from 'react-native-tts';
import LinearGradient from 'react-native-linear-gradient';
import Lottie from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';

const { width, height } = Dimensions.get('window');
const buttonSize = 30;
const buttonMargin = 20;

export default function HomeScreen() {

    const navigation = useNavigation();

    const handleScanTextButtonPress = () => {        
        navigation.navigate('ImageCrop');
    }

    return (
        <ImageBackground source={require('../assets/images/appbackground.jpeg')} style={styles.backgroundImage}>
            <View style={[styles.homeContainer]}>
                {/* <Lottie style={styles.lottie} source={require('../assets/animations/animation_lnqnjar2.json')} autoPlay loop /> */}
                {/* <Text style={styles.homeTitle}>Start Reading!</Text> */}
                <TouchableOpacity style={styles.circleButton} onPress={handleScanTextButtonPress}>
                    <Text style={styles.plusSign}>+</Text>
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
    lottie:{
        width: width*0.9,
        height: width
    },
    circleButton: {
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    plusSign: {
        fontSize: 100,
        fontWeight: 'bold',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
});