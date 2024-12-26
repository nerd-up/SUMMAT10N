import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RowBtn from '../components/RowBtn'
import AsyncStorage from '@react-native-async-storage/async-storage'
import auth from '@react-native-firebase/auth';

const Settings = ({navigation}:any) => {
     const signOut = () => {
        Alert.alert(
            "Logout Confirmation",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => {
                        auth().signOut().then(() => {
                            AsyncStorage.removeItem('userID');
                            navigation.navigate('Login');
                        }).catch(error => {
                            console.error("Sign out error: ", error);
                        });
                    }
                }
            ],
            { cancelable: true }
        );
    }

  return (
    <SafeAreaView>
        <View>
            <RowBtn onpress={signOut} title='Logout' />
            <RowBtn title='Delete Account' />
        </View>
    </SafeAreaView>
  )
}

export default Settings

const styles = StyleSheet.create({})