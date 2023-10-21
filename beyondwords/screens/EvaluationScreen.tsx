import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';

export default function EvaluationScreen({route}) {
    const { capturedText } = route.params;
    const [text, setText] = useState(capturedText);
    
    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.text}>Evaluation Screen</Text>
            <Text style={styles.text}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'OpenDyslexic-Bold',
        margin: 10,
    }
});