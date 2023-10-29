import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert, Switch } from 'react-native';
import Tts from 'react-native-tts';
import Voice, { SpeechEndEvent, SpeechErrorEvent, SpeechResultsEvent } from '@react-native-voice/voice';
import { useNavigation } from '@react-navigation/native';
import { TextSummarization } from '../utils/bert';
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Slider from '@react-native-community/slider';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

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
  const [isOpen, setOpen] = useState(false);
  const [isLetterSpacing, setIsLetterSpacing] = useState(false);
  const [letterSpacing, setLetterSpacing] = useState(0);

  useEffect(() => {
    Tts.setDefaultRate(readingSpeed);
    Tts.addEventListener('tts-finish', handleReadOutComplete);
  }, [readingSpeed]);

  const toggleSheet = () => {
    setOpen(!isOpen);
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

      const handleSummarizeText = async () => {
        setIsLoading(true);
        const summary = await TextSummarization(rawText);
        setIsLoading(false);
        if (summary === "ERROR") {
          Alert.alert(
            "AI Loading",
            "AI Model is being loaded... Please try again in a few seconds.",
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

      const handleFontSizeChange = (value) => {
        if (value === 0) {
          setFontSize(14);
        } else if (value === 1) {
          setFontSize(16);
        } else if (value === 2) {
          setFontSize(18);
        } else if (value === 3) {
          setFontSize(20);
        } else if (value === 4) {
          setFontSize(22);
        }
      };

      const handleLetterSpacingChange = (value: boolean) => {
        setIsLetterSpacing(value);
        setLetterSpacing(value ? 2 : 0);
      };
      // Rest of the code remains the same

      return (
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <Image source={require('../assets/images/beyondwords.png')} style={styles.logo} />
            <Text style={styles.headerText}>BeyondWords AI Reader</Text>
          </View>
          <ScrollView style={{ flex: 1 }}>
            <Text style={[styles.text, { fontSize: fontSize }, { letterSpacing }]}>{text}</Text>
          </ScrollView>
          {isOpen && (
            <GestureHandlerRootView style={styles.container}>
              <SafeAreaProvider>
                  <View style={styles.sheet}>
                    <Text style={styles.label}>Adjust Text Size</Text>
                    <Slider
                      style={{ width: "100%" }}
                      minimumValue={0}
                      maximumValue={4}
                      step={1}
                      value={2}
                      onValueChange={(value) => handleFontSizeChange(value)}
                      thumbTintColor="#90AAE7"
                      minimumTrackTintColor="#90AAE7"
                      maximumTrackTintColor="#000000"
                      thumbStyle={{ height: 20, width: 20, backgroundColor: '#90AAE7' }}
                      trackStyle={{ height: 5, backgroundColor: '#000000' }}
                      thumbTouchSize={{ width: 50, height: 50 }}
                      animateTransitions={true}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.sliderlabel}>Small</Text>
                      <Text style={styles.sliderlabel}>Normal</Text>
                      <Text style={styles.sliderlabel}>Large</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                      <Text style={[styles.label, { marginRight: 10 }]}>Letter Spacing</Text>
                      <Switch
                        trackColor={{ false: "lightgray", true: "#81b0ff" }}
                        thumbColor={isLetterSpacing ? "lightblue" : "gray"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={(value) => handleLetterSpacingChange(value)}
                        value={isLetterSpacing}
                      />
                    </View>
                  </View>               
              </SafeAreaProvider>
            </GestureHandlerRootView>
          )}
          <View style={styles.controls}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <View style={styles.circle}>
                <Text style={styles.circleText}>🏠</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleSheet}>
              <View style={styles.circle}>
                <Text style={styles.circleText}>aA</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleReadOut}>
              <View style={[styles.circle, isReading && { backgroundColor: '#8BD4BD' }, isReadingComplete && { backgroundColor: '#90AAE7' }]}>
                <Text style={styles.circleText}>{isReading ? '||' : '🔊'}</Text>
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={handleDecreaseSpeed}>
              <View style={styles.circle}>
                <Text style={styles.circleText}>-</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleIncreaseSpeed}>
              <View style={styles.circle}>
                <Text style={styles.circleText}>+</Text>
              </View>
            </TouchableOpacity> */}
            {/* <TouchableOpacity onPress={handleVoiceRecognition}>
              <View style={[styles.circle, { backgroundColor: isRecording ? '#8BD4BD' : '#90AAE7' }]}>
                <Text style={styles.circleText}>🎤</Text>
              </View>
            </TouchableOpacity> */}
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
      container: {
        flex: 0.3,
        backgroundColor: "lightblue",
      },
      sheet: {
        backgroundColor: "#e0f2ff",
        padding: 16,
        height: 175,
        width: "100%",
        position: "absolute",
        bottom: -5 * 1.1,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        zIndex: 2,
      },
      // backdrop: {
      //   ...StyleSheet.absoluteFillObject,
      //   backgroundColor: "rgba(0,0,0,0.5)",
      //   zIndex: 1,
      // },
      label: {
        margin: 10,
        fontSize: 17,
      },
      sliderlabel: {
        fontSize: 12,
      },          
      text: {
        fontFamily: 'OpenDyslexic-Bold',
        margin: 10,
      },
      headerText: {
        fontFamily: 'OpenDyslexic-Bold',
        margin: 10,
        fontSize: 20,
        marginTop: 13,
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
