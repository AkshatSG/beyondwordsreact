import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import Tts from 'react-native-tts';
import Voice from '@react-native-voice/voice';
import { useNavigation } from '@react-navigation/native';
import { TextSummarization } from '../utils/bert';

export default function ReaderScreen({ route }) {
  const { text } = route.params;
  const [fontSize, setFontSize] = useState<number>(20);
  const [isReading, setIsReading] = useState(false);
  const [isReadingComplete, setIsReadingComplete] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState<number>(0.5);
  const [isRecording, setIsRecording] = useState(false);
  const [capturedText, setCapturedText] = useState('');
  const [rawText, setRawText] = useState(text);
  const [voiceRecognitionActive, setVoiceRecognitionActive] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [summaryText, setSummaryText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    Tts.setDefaultRate(readingSpeed);
    Tts.addEventListener('tts-finish', handleReadOutComplete);
  }, [readingSpeed]);

  const handleIncreaseFontSize = () => {
    setFontSize((prevFontSize) => prevFontSize + 2);
  }

  const handleDecreaseFontSize = () => {
    setFontSize((prevFontSize) => prevFontSize - 2);
  }

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
    const newSpeed = readingSpeed + 2;
    setReadingSpeed(newSpeed);
    Tts.setDefaultRate(newSpeed);
  }

  const handleDecreaseSpeed = () => {
    const newSpeed = readingSpeed - 2;
    setReadingSpeed(newSpeed);
    Tts.setDefaultRate(newSpeed);
  }

  const handleVoiceRecognition = () => {
    if (!voiceRecognitionActive) {
      // Start voice recognition
      setVoiceRecognitionActive(true);
      setIsRecording(true);
      Voice.start('en-US').catch((e) => console.error(e));
    } else {
      // Stop voice recognition
      setVoiceRecognitionActive(false);
      setIsRecording(false);
      Voice.stop().catch((e) => console.error(e));
    }
  }

  const handleSummarizeText = async () => {
    setIsLoading(true);
    const summary = await TextSummarization(rawText);
    setIsLoading(false);
    if (summary === "ERROR") {
      Alert.alert(
        "Error",
        "An error occurred while summarizing the text. Please try again in a few minutes.",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
            style: "cancel"
          }
        ]
      );
    } else {
      setSummaryText(summary);
      navigation.navigate('AISummary', { text: summary });
    }
  }

  // Rest of the code remains the same

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Image source={require('../assets/images/beyondwords.png')} style={styles.logo} />
        <Text style={styles.headerText}>Read Easy: Your Digital Portal</Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <Text style={[styles.text, { fontSize: fontSize }]}>{text}</Text>
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
        <TouchableOpacity onPress={handleSummarizeText}>
          <View style={styles.circle}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.circleText}>📝</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'OpenDyslexic-Bold',
    margin: 10,
  },
  headerText: {
    fontFamily: 'OpenDyslexic-Bold',
    margin: 10,
    fontSize: 17,
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
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },

  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
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
});
