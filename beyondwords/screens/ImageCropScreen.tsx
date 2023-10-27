import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { RNCamera } from 'react-native-camera';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import Tts from 'react-native-tts';
import { useNavigation } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';

const { width, height } = Dimensions.get('window');
const buttonSize = 30;
const buttonMargin = 20;

export default function ImageCropScreen() {
    const [picture, setPicture] = useState<string | null>(null);
    const [text, setText] = useState<string | null>(null);
    const [showImage, setShowImage] = useState<boolean>(false);
    const [fontSize, setFontSize] = useState<number>(20);
    const [tickClicked, setTickClicked] = useState<boolean>(false);
    const [isReading, setIsReading] = useState(false); // Add state variable for read out button
    const cameraRef = React.useRef<RNCamera | null>(null);

    const navigation = useNavigation();

    const handleImageCorrection = async () => {
        try {
          const image = await ImagePicker.openCropper({
            path: picture,
            width: 1000, // Width of the corrected image
            height: 800, // Height of the corrected image
            cropping: true,
            hideBottomControls: true,
            cropperToolbarTitle: 'Crop Image',
            cropperToolbarColor: '#90AAE7',
            cropperStatusBarColor: '#90AAE7',
            cropperCircleOverlay: false,
            freeStyleCropEnabled: true,
            enableRotationGesture: true,            
            compressImageMaxHeight: 1000,
            compressImageMaxWidth: 1500,
          }).then(image => {
            setPicture(image.path);
          });
          // Handle the corrected image (e.g., save, display, or further processing)
        } catch (error) {
          console.log('Error while cropping image: ', error);
        }
      };

    const handleRetakeButtonPress = () => {
        setPicture(null);
        setText(null);
        setShowImage(false);
        setTickClicked(false);
    };

    const handleTickMark = async () => {
        const options = { quality: 0.5, base64: true };
        const recognizedText = await TextRecognition.recognize(picture);
        const cleanText = recognizedText.text.replace(/[\n\r]+/g, ' ');
        navigation.navigate('Reader', { text: cleanText });
    };

    const handleTakePictureButtonPress = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.5, base64: true };
            const data = await cameraRef.current.takePictureAsync(options);
            console.log(data.uri);
            setPicture(data.uri);
            setShowImage(true);
        }
    };

    const handleIncreaseFontSize = () => {
        setFontSize((prevFontSize) => prevFontSize + 2);
    };

    const handleXMark = () => {
        setPicture(null);
        setText(null);
        setShowImage(false);
        setTickClicked(false);
    };

    const handleDecreaseFontSize = () => {
        setFontSize((prevFontSize) => prevFontSize - 2);
    };

    const handleCancelButtonPress = () => {
        setPicture(null);
        setText(null);
        setShowImage(false);
        setTickClicked(false);
        navigation.goBack();
    };

    const handleRetakeImage = () => {
        setPicture(null);
        setText(null);
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

        return (
            <>
                {picture ? (
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
                                        <View style={[styles.circle, isReading && { backgroundColor: 'yellow' }]}>
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
                            <View style={styles.controls}>
                                <TouchableOpacity onPress={handleTickMark}>
                                    <View style={styles.circle}>
                                        <Text style={styles.circleText}>✔</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleImageCorrection}>
                                    <View style={styles.circle}>
                                        <Text style={styles.circleText}>✂︎</Text>
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
                        <RNCamera ref={cameraRef} style={{ flex: 1 }}>
                            <TouchableOpacity onPress={handleTakePictureButtonPress} style={styles.cameraButton}>
                                <View style={styles.cameraButtonInner} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCancelButtonPress} style={styles.cancelButton}>
                                <View style={styles.cancelButtonText}><Text>X</Text></View>
                            </TouchableOpacity>
                        </RNCamera>
                    </>
                )}
            </>
        );
    }

    const styles = StyleSheet.create({
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
            width: 40,
            height: 40,
            borderRadius: 40 / 2,
            backgroundColor: '#90AAE7',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            },
        circleText: {
            fontSize: 20,
            fontWeight: 'bold',
        },
        cameraButton: {
            position: 'absolute',
            bottom: 20,
            alignSelf: 'center',
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
        },
        cameraButtonInner: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#646262',
        },
        cancelButton: {
            position: 'absolute',
            top: buttonMargin,
            right: buttonMargin,
            width: buttonSize,
            height: buttonSize,
            borderRadius: buttonSize / 2,
            backgroundColor: '#ccc',
            justifyContent: 'center',
            alignItems: 'center',
        },
        cancelButtonText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#fff',
        },
        controls: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderTopWidth: 1,
            borderTopColor: '#000',
          },        
    });