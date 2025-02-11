/**
 * @file SignUpForm.tsx
 * @description Components for authenticating users.
 * @ownership Christian Marcellino
 * @last modified 9/23/2023
 */

import React, { useEffect, useState } from 'react';
import { Alert, BackHandler, Text, TextInput, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import auth from '@react-native-firebase/auth';
import firestore, { count } from '@react-native-firebase/firestore';
import { overwrite, getName, getCode } from 'country-list';
import countryList from 'country-list';
import { setInProfile } from '../services/DataService';
import formStyles from '../styles/FormStyles';
import styles from '../styles/Styles';
import SButton from './SButton';
import useLoadingStore from '../zustand/UseLoadingStore';
import Colors from '../theme/ScholarColors';
import { showSucess } from '../utils/utility';

type SignUpFormProps = {
    nav?: any,
}

/**
 * Used to create a sign in form that connects with Firebase.
 * 
 * On Submit: Adds the new user to the Users firestore database collection.
 * @param props (nav) property used to pass in the current navigation controls.
 */
export default function SignUpForm(props: SignUpFormProps) {

    const [usrName, setUserName] = useState("");
    const [usrEmail, setUserEmail] = useState("");
    const [usrPassword1, setUserPassword1] = useState("");
    const [usrPassword2, setUserPassword2] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const { allowLoading, disableLoading } = useLoadingStore();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [items, setItems] = useState(countryList.getNames());
    async function tryAndSignIn() {

        setIsSubmitDisabled(true);

        if (usrName.length === 0) {
            setErrorMsg("Name required!");
            setIsSubmitDisabled(false);
            return;
        }

        if (usrEmail.length === 0) {
            setErrorMsg("Email required!");
            setIsSubmitDisabled(false);
            return;
        }

        if (usrPassword1.length === 0) {
            setErrorMsg("Password required!");
            setIsSubmitDisabled(false);
            return;
        }

        if (usrPassword1.length === 0) {
            setErrorMsg("Must re-type password!");
            setIsSubmitDisabled(false);
            return;
        }

        if (usrPassword1 !== usrPassword2) {
            setErrorMsg("Passwords do not match!");
            setIsSubmitDisabled(false);
            return;
        }
        allowLoading();
        // creates and authenticates a new user
        auth().createUserWithEmailAndPassword(usrEmail, usrPassword1)
            .then(async result => {
                const user = auth().currentUser;
                await user?.sendEmailVerification();
                const userId: any = user?.uid;
                //console.log(userId)
               
                showSucess('Success', 'You Signed Up Successfully, Check your email!')
                // adds the new user to the Users firestore database collection
                setInProfile(userId, 'no bio', ' ', value, usrName,'')
                disableLoading();
            })
            .catch(error => {
                // Alert.alert("Error creating account!");
                setErrorMsg(error?.code);
                console.log(error,"wwaaaahg waaah");
                disableLoading();
                setIsSubmitDisabled(false);
            });
    }
    const countryOptions = countryList.getNames().map((country) => ({
        label: country,
        value: country,
    }));
    
    return (
        <View style={formStyles.submitContainer}>
            {/* Input Fields */}
            <View>
                <TextInput placeholderTextColor={'grey'} style={styles.formField} placeholder='Enter Name...' onChangeText={text => setUserName(text)}></TextInput>
                <TextInput placeholderTextColor={'grey'} style={styles.formField} placeholder='Enter Email...' onChangeText={text => setUserEmail(text)}autoCapitalize="none"></TextInput>
                <TextInput placeholderTextColor={'grey'} style={styles.formField} placeholder='Enter Password...' onChangeText={text => setUserPassword1(text)} secureTextEntry={true}></TextInput>
                <TextInput placeholderTextColor={'grey'} style={styles.formField} placeholder='Confirm Password...' onChangeText={text => setUserPassword2(text)} secureTextEntry={true}></TextInput>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={countryOptions}
                    setOpen={setOpen}
                    setValue={setValue}
                    placeholder='Select a Country'
                    setItems={setItems}
                    searchable
                    style={styles.formField}
                    searchPlaceholder='search'
                />
            </View>

            <Text style={{ color: "red" }}>{errorMsg?.toString()}</Text>

            {/* Submit Button */}
            <View style={formStyles.submitBtnContainer}>
                <SButton text="Sign Up" action={() => tryAndSignIn()}></SButton>
                <SButton styleType="Sentence" text="Already have an account? Login" action={() => props.nav.navigate('Login')}></SButton>
            </View>

        </View>)
}

