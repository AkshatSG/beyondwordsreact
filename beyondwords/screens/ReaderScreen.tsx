import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Tts from 'react-native-tts';
import { RouteProp } from '@react-navigation/native';
import Voice from '@react-native-voice/voice';
import { useNavigation } from '@react-navigation/native';

export default function ReaderScreen({route}) {
    const { text } = route.params;
    const [fontSize, setFontSize] = useState<number>(20);
    const [isReading, setIsReading] = useState(false);
    const [isReadingComplete, setIsReadingComplete] = useState(false);
    const [readingSpeed, setReadingSpeed] = useState<number>(0.5);
    const [isRecording, setIsRecording] = useState(false);
    const [capturedText, setCapturedText] = useState('');
    const [rawText, setRawText] = useState(text);
    const navigation = useNavigation();

    useEffect(() => {
        Tts.setDefaultRate(readingSpeed);
        Tts.addEventListener('tts-finish', handleReadOutComplete);
        // return () => {
        //     Tts.remove('tts-finish', handleReadOutComplete);
        // };
    }, [readingSpeed]);

    const handleIncreaseFontSize = () => {
        setFontSize((prevFontSize) => prevFontSize + 2);
    };
    
    const handleDecreaseFontSize = () => {
        setFontSize((prevFontSize) => prevFontSize - 2);
    };

    const handleReadOut = () => {
        if (!isReading && text) {
            setIsReading(true);
            Tts.speak(text, { rate: readingSpeed });
        } else {
            setIsReading(false);
            Tts.stop();
        }
    }

    const handleReadOutComplete = () => {
        setIsReadingComplete(true);
        setIsReading(false);
    }

    const handleIncreaseSpeed = () => {
        setReadingSpeed((prevSpeed) => prevSpeed + 0.5);
    }

    const handleDecreaseSpeed = () => {
        setReadingSpeed((prevSpeed) => prevSpeed - 0.5);
    }

    const handleVoiceRecognition = async () => {
        if (!isRecording) {
            setIsRecording(true);
            try {
                await Voice.start('en-US');
            } catch (e) {
                console.error(e);
            }
        } else {
            setIsRecording(false);
            try {
                await Voice.stop();
            } catch (e) {
                console.error(e);
            }
        }
    }

    const handleVoiceRecognitionResult = (e: any) => {        
        setCapturedText(e.value[0]);
        setIsRecording(false);
        Voice.destroy().then(Voice.removeAllListeners);
        console.log('CAPUCINO WHAHAHAHA');
        navigation.navigate('Evaluation', { capturedText: capturedText });
    }

    useEffect(() => {
        Voice.onSpeechResults = handleVoiceRecognitionResult;
        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    useEffect(() => {
        if (!isRecording && capturedText) {
            console.log(capturedText);
        }
    }, [isRecording]);

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <Text style={[styles.text, { fontSize: fontSize }]}>
                    {text}
                </Text>
            </ScrollView>
            <View style={styles.controls}>
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
                    <View style={[styles.circle, isReading && { backgroundColor: '#8BD4BD' }, isReadingComplete && { backgroundColor: '#90AAE7' }]}>
                        <Text style={styles.circleText}>{isReading ? '||' : '🔊'}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDecreaseSpeed}>
                    <View style={styles.circle}>
                        <Text style={styles.circleText}>-</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleIncreaseSpeed}>
                    <View style={styles.circle}>
                        <Text style={styles.circleText}>+</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleVoiceRecognition}>
                    <View style={[styles.circle, { backgroundColor: isRecording ? '#8BD4BD' : '#90AAE7' }]}>
                        <Text style={styles.circleText}>{isRecording ? '🎤' : '🎤'}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'OpenDyslexic-Bold',
        margin: 10,
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 40/2,
        backgroundColor: '#90AAE7',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    circleText: {
        fontSize: 20,
        fontWeight: 'bold',        
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