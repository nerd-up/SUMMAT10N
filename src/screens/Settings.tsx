import { Alert, SafeAreaView, StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import { showError } from '../utils/utility';
import { deleteProfile, setInProfile } from '../services/DataService';
import { getUserId } from '../utils/Auth';
import useUserProfileStore from '../zustand/UserProfileStore';

const Settings = ({ navigation }: any) => {
	const userProfile: any = useUserProfileStore(store => store)
   
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
                            setInProfile('','','','','')
                            navigation.navigate('Login');
                        }).catch(error => {
                            console.error("Sign out error: ", error);
                        });
                    }
                }
            ],
            { cancelable: true }
        );
    };

    const deleteUser = () => {
        Alert.alert(
            "Account Deletion Confirmation",
            "Are you sure you want to Delete your account? You will not be able to login again...",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => {
                        auth().currentUser?.delete().then(() => {
                            AsyncStorage.removeItem('userID');
                            setInProfile(userProfile?.userID,'','','','')
                            navigation.navigate('Login');
                        }).catch(error => {
                            showError('Failed', 'Maybe you need to login again!\n'+error?.code);
                            console.error("Account Deletion Error error: ", error);
                        });
                    }
                }
            ],
            { cancelable: false }
        );
    }


    return (
        <SafeAreaView style={styles.container}>
            {/* Background Image */}
            <ImageBackground 
                source={require('../assets/icons/sum.png')} // Adjust path as needed
                style={styles.backgroundImage}
            >
                <View style={styles.content}>
                    <Text style={styles.headerText}>Settings</Text>

                    {/* Logout Button */}
                    <TouchableOpacity style={styles.button} onPress={signOut}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>

                    {/* Delete Account Button */}
                    <TouchableOpacity onPress={deleteUser} style={[styles.button, styles.deleteButton]}>
                        <Text style={styles.buttonText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default Settings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // Ensures the image covers the screen
        justifyContent: 'center', // Centers the content inside the background
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)', // Adds a slight dark overlay for readability
        padding: 20,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#3498db', // Blue color for the button
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%', // Adjust width as needed
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#e74c3c', // Red color for delete button
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
