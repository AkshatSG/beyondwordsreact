import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Tts from 'react-native-tts';
import { RouteProp } from '@react-navigation/native';

export default function ReaderScreen({route}) {
    const { text } = route.params;
    const [fontSize, setFontSize] = useState<number>(20);
    const [isReading, setIsReading] = useState(false); // Add state variable for read out button
    
    const handleIncreaseFontSize = () => {
        setFontSize((prevFontSize) => prevFontSize + 2);
    };
    
    const handleDecreaseFontSize = () => {
        setFontSize((prevFontSize) => prevFontSize - 2);
    };

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
        <ScrollView style={{ flex: 1 }}>
            <Text style={[styles.text, { fontSize: fontSize }]}>
                {text}
            </Text>
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
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'OpenDyslexic-Bold',
        margin: 10,
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
    }
});