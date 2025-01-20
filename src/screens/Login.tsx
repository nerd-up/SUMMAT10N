import React, { useState, useEffect } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';


import Divider from '../components/Divider';
import LoginForm from '../components/LoginForm';
import MissionLine from '../components/MissionLine';
import ScholarBanner from '../components/UnifyBanner';
import formStyles from '../styles/FormStyles';
import styles from '../styles/Styles';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import { appleAuth } from '@invertase/react-native-apple-authentication';

import firestore from '@react-native-firebase/firestore';
import useUserProfileStore from '../zustand/UserProfileStore';
import { getUserId } from '../utils/Auth';

function Login({ navigation }: any) {
    const [timeLeft, setTimeLeft] = useState("");
    const setProfileData = useUserProfileStore(store => store.setProfileData)

    async function onAppleButtonPress() {
        try {
            // Start the Apple sign-in request
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
            });
            console.log("appleAuthRequestResponse:",JSON.stringify(appleAuthRequestResponse,null,2));
            // Ensure Apple returned a user identityToken
            if (!appleAuthRequestResponse.identityToken) {
                throw new Error('Apple Sign-In failed - no identity token returned');
            }

            // Extract identityToken and nonce
            const { identityToken, nonce } = appleAuthRequestResponse;

            // Create a Firebase credential from the Apple response
            const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
           
            // Sign in with the Firebase credential
            const userCredential = await auth().signInWithCredential(appleCredential);
            console.log(JSON.stringify(userCredential,null,2),"these are dataaas");
            // Retrieve user information
            const uid  = userCredential.user.uid;
            console.log(uid);
            
            const fullName = appleAuthRequestResponse.fullName?.givenName || 'User';
            const email = userCredential.user.email || appleAuthRequestResponse.email || '';
            const userDocRef = firestore().collection('users').doc(uid);
            const userDoc = await userDocRef.get();
            if (!userDoc.exists) {
                // Create the document if it doesn't exist
                await userDocRef.set({
                    bio: 'no bio',
                    userID: uid,
                    profilePic: '',
                    residency: '',
                    usrName: email?.split('@')?.shift(),
                    email:email,
                    signed: '',
                    createdAt: firestore.FieldValue.serverTimestamp(),
                });
                setProfileData({
                    bio: 'no bio',
                    userID: uid,
                    profilePic: '',
                    residency: '',
                    usrName: email?.split('@')?.shift(),
                    email:email,
                    signed: '',
                    createdAt: firestore.FieldValue.serverTimestamp(),
                })
                navigation.navigate('Splash', { uid });
                console.log('User profile created successfully in Firestore');
            } else {
                navigation.navigate('Splash', { uid });
                console.log('User profile already exists in Firestore');
            }
        } catch (error) {
            console.error('Error during Apple Sign-In:', error);
        }
    }
    useEffect(() => {
        const targetDate = new Date("2030-01-01T00:00:00Z").getTime();


        const updateCountdown = () => {
            const now = new Date().getTime();
            const timeDiff = targetDate - now;


            if (timeDiff > 0) {
                const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);


                setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft("Goal Reached!");
            }
        };


        const intervalId = setInterval(updateCountdown, 1000);


        return () => clearInterval(intervalId);
    }, []);


    return (
        <ScrollView style={styles.container}>
            <ScholarBanner text="Login" />
            {/* Countdown */}
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#555' }}>
                    COUNTDOWN: {timeLeft}
                </Text>
            </View>
            {/* Form */}
            <View style={formStyles.container}>
                <LoginForm nav={navigation} />
                <Divider text="OR" />
                <MissionLine text="Join With" />
                <AppleButton
                    buttonStyle={AppleButton.Style.WHITE}
                    buttonType={AppleButton.Type.SIGN_IN}
                    style={{
                        width: '98%',
                        height: 45,
                    }}
                    onPress={() => onAppleButtonPress().then((res) => console.log('Apple sign-in complete!', res))}
                />
            </View>
            
        </ScrollView>
    );
}


export default Login;


//This is working code for 12/23/24 for the login screen.  Wanted to save it here before I mess anything else up. 

