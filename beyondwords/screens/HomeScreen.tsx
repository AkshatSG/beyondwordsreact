import React, { useState, useRef } from 'react';
import { Button, Image, View, Text, StyleSheet, ScrollView } from 'react-native';
import { RNCamera } from 'react-native-camera';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import Tts from 'react-native-tts';


export default function HomeScreen() {
    const cameraRef = useRef<RNCamera | null>(null);
    const [picture, setPicture] = useState<string | null>(null);
    const [text, setText] = useState<string | null>(null);
    const [fontSize, setFontSize] = useState<number>(20);
    const [showHome, setShowHome] = useState<boolean>(false);
    
    const handleRetakeButtonPress = () => {
        setPicture(null);
        setText(null);
        setShowHome(false);
    };

    const handleTakePictureButtonPress = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.5, base64: true };
            const data = await cameraRef.current.takePictureAsync(options);
            setPicture(data.uri);
            const recognizedText = await TextRecognition.recognize(data.uri);
            setText(recognizedText.text); // Update the setText function to accept a string
            console.log(recognizedText.text)
            setShowHome(false);
        }
    };

    const handleIncreaseFontSize = () => {
        setFontSize((prevFontSize) => prevFontSize + 2);
    };

    const handleDecreaseFontSize = () => {
        setFontSize((prevFontSize) => prevFontSize - 2);
    };

    const handleReadOut = () => {
        if (text) {
            Tts.speak(text.replace(/\n/, ""));
        }
    };

    const handleScanTextButtonPress = () => {
        setShowHome(false);
    };

    const handleCancelButtonPress = () => {
        setPicture(null);
        setText(null);
        setShowHome(true);
    };

    return (
        <>
            {showHome ? (
                <View style={[styles.homeContainer]}>
                    <Text style={styles.homeTitle}>Home</Text>
                    <Button title="Scan Text" onPress={handleScanTextButtonPress} />
                </View>
            ) : picture ? (
                <View style={{ flex: 1 }}>
                    <Image source={{ uri: picture }} style={{ flex: 1 }} resizeMode="contain" />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                        <Button title="Retake" onPress={handleRetakeButtonPress} />
                        <View style={{ flexDirection: 'row' }}>
                            <Button title="+" onPress={handleIncreaseFontSize} />
                            <Button title="-" onPress={handleDecreaseFontSize} />
                        </View>
                    </View>
                    {text ? (
                        <ScrollView style={{ flex: 1 }}>
                            <Text style={[styles.text, { fontSize: fontSize }]}>
                                {text}
                            </Text>
                            <Button title="READ OUT" onPress={handleReadOut} />
                        </ScrollView>
                    ) : null}
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
});

