/**
 * @file SignUp.tsx
 * @description ?
 * @ownership ?
 * @last modified 9/20/2023
 */

import React, { useEffect } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import Divider from '../components/Divider';
import ScholarBanner from '../components/UnifyBanner';
import SignUpForm from '../components/SignUpForm';
import formStyles from '../styles/FormStyles';
import styles from '../styles/Styles';
import { overwrite, getName, getCode } from 'country-list';
import countryList from 'country-list';
import Loading from '../components/loadings/Loading';
function SignUp({ navigation }: any) {
    // async function onAppleButtonPress() {
    //     // Start the sign-in request
    //     // console.log("i am here");
    //     const appleAuthRequestResponse = await appleAuth.performRequest({
    //         requestedOperation: appleAuth.Operation.LOGIN,
    //         // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
    //         // See: https://github.com/invertase/react-native-apple-authentication#faqs
    //         requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    //     });

    //     console.log(appleAuthRequestResponse);
    //     // Ensure Apple returned a user identityToken
    //     if (!appleAuthRequestResponse.identityToken) {
    //         throw new Error('Apple Sign-In failed - no identify token returned');
    //     }

    //     // Create a Firebase credential from the response
    //     const { identityToken, nonce } = appleAuthRequestResponse;
    //     const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
    //     console.log(appleCredential);
    //     // Sign the user in with the credential
    //     return auth().signInWithCredential(appleCredential);
    // }
    
    return (
        <ScrollView style={styles.container}>
    <Loading />
            <ScholarBanner text="Sign Up" />
            {/* Form */}
            <View style={formStyles.container}>
                <SignUpForm nav={navigation} />
                <Divider text="Time To Stand" />
               
                {/* Other Sign In Options */}
                {/* <View>
                    <TouchableOpacity style={[formStyles.submitBtn, { backgroundColor: '#d00000', flexDirection: "row", justifyContent: "center", columnGap: 10 }]}>
                        <Image source={require('../assets/icons/google.png')}   style={{height:30,width:30}}/>
                        <Text style={styles.btnText}>Sign In with Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[formStyles.submitBtn, { backgroundColor: '#023e8a', flexDirection: "row", justifyContent: "center", columnGap: 10 }]}>
                        <Image source={require('../assets/icons/facebook.png')}   style={{height:30,width:30}}/>
                        <Text style={styles.btnText}>Sign In With Facebook</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        </ScrollView>
    )
}

export default SignUp