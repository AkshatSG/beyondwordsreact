import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { RNCamera } from 'react-native-camera';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import Tts from 'react-native-tts';
import LinearGradient from 'react-native-linear-gradient';
import Lottie from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import Scanner from "react-native-rectangle-scanner"

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const [picture, setPicture] = useState<string | null>(null);
    const [text, setText] = useState<string | null>(null);
    const [showHome, setShowHome] = useState<boolean>(true);
    const [showImage, setShowImage] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState<number>(20);
    const [tickClicked, setTickClicked] = useState<boolean>(false);
    const [isReading, setIsReading] = useState(false); // Add state variable for read out button
    const cameraRef = React.useRef<RNCamera | null>(null);

    const navigation = useNavigation();

    const handleRetakeButtonPress = () => {
        setPicture(null);
        setText(null);
        setShowHome(false);
        setShowImage(false);
        setTickClicked(false);
    };

    const handleTickMark = async () => {
            const options = { quality: 0.5, base64: true };
            const recognizedText = await TextRecognition.recognize(picture);
            navigation.navigate('Reader', { text: recognizedText.text });
            // setText(recognizedText.text); // Update the setText function to accept a string
            // console.log(recognizedText.text)
            // setShowHome(false);
            // setTickClicked(true);
    };

    const handleTakePictureButtonPress = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.5, base64: true };
            const data = await cameraRef.current.takePictureAsync(options);
            setPicture(data.uri);
            setShowHome(false);
            setShowImage(true);
        }
    };

    const handleIncreaseFontSize = () => {
        setFontSize((prevFontSize) => prevFontSize + 2);
    };

    const handleXMark = () => {
        setPicture(null);
        setText(null);
        setShowHome(false);
        setShowImage(false);
        setTickClicked(false);
    };

    const handleDecreaseFontSize = () => {
        setFontSize((prevFontSize) => prevFontSize - 2);
    };

    // const handleReadOut = () => {
    //     if (text) {
    //         Tts.speak(text.replace(/\n/, ""));
    //     }
    // };

    const handleScanTextButtonPress = () => {
        setShowHome(false);
        // navigation.navigate('Scanner');
    }

    const handleCancelButtonPress = () => {
        setPicture(null);
        setText(null);
        setShowHome(true);
        setShowImage(false);
        setTickClicked(false);
    };

    const handleRetakeImage = () => {
        setPicture(null);
        setText(null);
        setShowHome(true);
        setShowImage(false);
        setTickClicked(false);
    }

    const handleReadOut = () => {
        if (!isReading && text) {
            setIsReading(true);
            Tts.speak(text);
        } else {
            setIsReading(false);
            Tts.stop();
        }
    }

    // const HomeScreen = () => {
    //     const [picture, setPicture] = useState(null);
    //     const [text, setText] = useState(null);
    //     const [showHome, setShowHome] = useState(true);
    //     const [showImage, setShowImage] = useState(false);
    //     const [tickClicked, setTickClicked] = useState(false);
    //     const [fontSize, setFontSize] = useState(20);
    //     const [isReading, setIsReading] = useState(false); // Add state variable for read out button

    //     const handleCancelButtonPress = () => {
    //         setPicture(null);
    //         setText(null);
    //         setShowHome(true);
    //         setShowImage(false);
    //         setTickClicked(false);
    //     };

    //     const handleRetakeImage = () => {
    //         setPicture(null);
    //         setText(null);
    //         setShowHome(true);
    //         setShowImage(false);
    //         setTickClicked(false);
    //     }

    //     const handleOCR = async () => {
    //         const recognizedText = await TextRecognition.recognize(picture);
    //         setText(recognizedText.text); // Update the setText function to accept a string
    //         console.log(recognizedText.text)
    //         setShowImage(false);
    //         setTickClicked(false);
    //     }

    //     const handleReadOut = () => {
    //         if (!isReading && text) {
    //             setIsReading(true);
    //             Tts.speak(text);
    //         } else {
    //             setIsReading(false);
    //             Tts.stop();
    //         }
    //     }

        return (
            <>
                {showHome ? (
                    <View style={[styles.homeContainer]}>
                        <LinearGradient colors={['#F5DEB3', '#D2B48C', '#BC8F8F']} style={styles.linearGradient}>
                        <Lottie style={styles.lottie} source={require('../assets/animations/animation_lnqnjar2.json')} autoPlay loop />
                        <Text style={styles.homeTitle}>Start Reading!</Text>
                        <Button title="Scan Text" onPress={handleScanTextButtonPress} />
                        </LinearGradient>
                    </View>
                ) : picture ? (
                    <View style={{ flex: 1 }}>
                        <Image source={{ uri: picture }} style={{ flex: 1 }} resizeMode="contain" />
                        {tickClicked ? (
                            <>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                                    <TouchableOpacity onPress={handleRetakeButtonPress}>
                                        <View style={styles.circle}>
                                            <Text style={styles.circleText}>⟲</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleDecreaseFontSize}>
                                        <View style={styles.circle}>
                                            <Text style={styles.circleText}>-</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleIncreaseFontSize}>
                                        <View style={styles.circle}>
                                            <Text style={styles.circleText}>+</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleReadOut}>
                                        <View style={[styles.circle, isReading && { backgroundColor: 'yellow' }]}> // Apply different style based on isReading
                                            <Text style={styles.circleText}>🔊</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                {text ? (
                                    <ScrollView style={{ flex: 1 }}>
                                        <Text style={[styles.text, { fontSize: fontSize }]}>
                                            {text}
                                        </Text>
                                    </ScrollView>
                                ) : null}
                            </>
                        ) : (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                                <TouchableOpacity onPress={handleTickMark}>
                                    <View style={styles.circle}>
                                        <Text style={styles.circleText}>✔</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleXMark}>
                                    <View style={styles.circle}>
                                        <Text style={styles.circleText}>X</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ) : (
                    <>
                        <RNCamera ref={cameraRef} style={{ flex: 1 }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                            <Button title="Take Picture" onPress={handleTakePictureButtonPress} />
                            <Button title="Cancel" onPress={handleCancelButtonPress} />
                        </View>
                    </>
                )}
            </>
        );
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
        linearGradient: {
            flex: 1,
            paddingLeft: 25,
            // paddingRight: 25,z
            // borderRadius: 5
            },
        circle: {
            width: 50,
            height: 50,
            borderRadius: 50/2,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#000',
        },
        circleText: {
            fontSize: 30,
            fontWeight: 'bold',
        },
    });