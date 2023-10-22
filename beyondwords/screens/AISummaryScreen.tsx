import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';

export default function AISummaryScreen({route}) {
    const { text } = route.params;
    const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height);

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Image source={require('../assets/images/beyondwords.png')} style={styles.logo} />
                <Text style={styles.text}>Smart Summarizer - AI Powered</Text>
            </View>
            <ScrollView style={styles.textContainer}>
                <Text style={styles.text}>{text}</Text>
            </ScrollView>            
            <View style={[styles.disclaimerContainer, { bottom: screenHeight * -0.1}]}>
            <View style={styles.separator} />
                <Text style={styles.disclaimer}>Summary generated by an AI Large Language Model. Please validate the accuracy while using the content.</Text>          
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#ADD8E6',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 5,
    },
    logo: {
        width: 60,
        height: 60,
    },
    text: {
        fontSize: 17,
        fontFamily: 'OpenDyslexic-Bold',
        margin: 10,
    },
    textContainer: {
        flex: 1,
        margin: 10,
    },
    separator: {
        height: 1,
        backgroundColor: 'gray',
    },
    disclaimerContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
    },
    disclaimer: {
        fontSize: 10,
        textAlign: 'center',
        fontFamily: 'OpenDyslexic-Bold',
        margin: 10,
    }
});