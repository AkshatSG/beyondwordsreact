import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, ImageBackground } from 'react-native'
import React from 'react'
import Onboarding from 'react-native-onboarding-swiper';
import Lottie from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { setItem } from '../utils/asyncStorage';
import FontAdjustScreen from './FontAdjustScreen';

const {width, height} = Dimensions.get('window');

export default function OnboardingScreen() {
    const navigation = useNavigation();

    const handleDone = ()=>{        
        navigation.navigate('Home');
        setItem('onboarded', '1');
    }

    const doneButton = ({...props})=>{
        return (
            <TouchableOpacity style={styles.doneButton} {...props}>
                <Text>Done</Text>
            </TouchableOpacity>
        )        
    }
  return (
    <View style={styles.container}>
      <Onboarding
            onDone={handleDone}
            onSkip={handleDone}
            // bottomBarHighlight={false}
            DoneButtonComponent={doneButton}
            containerStyles={{paddingHorizontal: 15}}
            pages={[
                {
                    backgroundColor: '#c7ecee',
                    image: (
                        <View style={styles.lottie}>
                            <Image style={styles.image} source={require('../assets/images/beyondwords.png')} />
                        </View>
                    ),
                    title: 'Welcome to BeyondWords',
                    subtitle: 'Your AI powered reading guide',                    
                },
                {
                    backgroundColor: '#a7f3d0',
                    image: (
                        <View style={styles.lottie}>
                            <Lottie style={styles.lottie} source={require('../assets/animations/animation_lnpbqnyh.json')} autoPlay loop />
                        </View>
                    ),
                    title: 'Boost Your Reading',
                    subtitle: 'Scan any book and get a better reading experience',
                },
                {
                    backgroundColor: '#fef3c7',
                    image: (
                        <View style={styles.lottie}>
                            <Lottie style={styles.lottie} source={require('../assets/animations/animation_lnpxfc1g.json')} autoPlay loop />
                        </View>
                    ),
                    title: 'Improve Understanding',
                    subtitle: 'Get a better understanding of the material using our AI powered summarizer',
                },
                {
                    backgroundColor: '#a78bfa',
                    image: (
                        <View style={styles.lottie}>
                            <Lottie style={styles.lottie} source={require('../assets/animations/animation_lnpxpouw.json')} autoPlay loop />
                        </View>
                    ),
                    title: 'Achieve Higher Goals',
                    subtitle: 'Dyslexia friendly fonts and colors to help you achieve your reading goals',
                },
            ]}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    lottie:{
        width: width*0.9,
        height: width        
    },
    doneButton: {
        padding: 20,
        // backgroundColor: 'white',
        // borderTopLeftRadius: '100%',
        // borderBottomLeftRadius: '100%'
    },
    image:{
        width: width*0.9,
        height: width*0.9
    }
})