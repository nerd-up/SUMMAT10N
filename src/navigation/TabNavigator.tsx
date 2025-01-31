/**
 * @file TabNavigator.tsx
 * @description This script is responsible for controling tab navigation.
 * @ownership ?
 * @last modified 9/20/2023
 */

import React, { useEffect } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import auth from '@react-native-firebase/auth';

import Friends from '../screens/Friends';
import Home from '../screens/Home';
import Notifications from '../screens/Notifications';
import UserProfile from '../screens/UserProfile';
import Colors from '../theme/ScholarColors';
import { Alert, Image, TouchableOpacity } from 'react-native';
import SignForPeace from '../screens/SignForPeace';
import { useNavigation } from '@react-navigation/native';
import useUserProfileStore from '../zustand/UserProfileStore';
import Certificate from '../screens/Certificate';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { icons } from '../assets/icons';
import Donor from '../screens/Donor';
import { getProfile } from '../services/DataService';
import { getUserId } from '../utils/Auth';


const Tab = createBottomTabNavigator();

const routeIconUrls: { [key: string]: any } = {
    'Home': require('../assets/icons/home.png'),
    'Friends': require('../assets/icons/friends.png'),
    'Donor': require('../assets/icons/friends.png'),
    'Notifications': require('../assets/icons/bell-ring.png'),
    'UserProfile': require('../assets/icons/user.png'),
    'SignForPeace': require('../assets/icons/world-peace.png'),
    'Certificate': require('../assets/icons/world-peace.png')
};

function TabBarIcon({ iconName, focused }: any) {
    return (
        <Image source={iconName} style={{
            tintColor: focused ? Colors.primary : 'gray', height: focused ? 30 : 30, width
                : 30, margin: 10
        }} />
    );
};

function ScholarTabs() {
    const userProfile: any = useUserProfileStore(store => store)
    const setProfileData = useUserProfileStore(store => store.setProfileData)
    const navigation: any = useNavigation();
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
            { cancelable: false }
        );
    }
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
                            navigation.navigate('Login');
                        }).catch(error => {
                            console.error("Account Deletion Error error: ", error);
                        });
                    }
                }
            ],
            { cancelable: false }
        );
    }

    useEffect(()=>{
     getProfile(getUserId())
     .then((profile: any) => {
        console.log("lo pharro",profile);
        
        setProfileData(profile);
      })
      .catch(error => {
        console.error('Errffor :', error);
      });
    },[])
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle: {

                    backgroundColor: 'white',
                    padding: 10,
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                tabBarIcon: ({ focused }: any) => {
                    return <TabBarIcon iconName={routeIconUrls[route.name]} focused={focused} />
                },

            })}
        >
            <Tab.Screen name="Home" component={Home} options={{
                title: "Home", headerTitleStyle: {
                    color: Colors.primary, fontSize: 30
                }, headerStyle: {
                    backgroundColor: Colors.lightBackground
                }
                , headerRight: () =>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <Image style={{ height: 25, width: 25, marginRight: 10, tintColor: Colors.primary }} source={icons.settings}></Image>
                    </TouchableOpacity>
            }} />
            {
                userProfile.signed ?
                    <Tab.Screen name="Certificate" component={Certificate} options={{ headerShown: false }} />
                    :
                    <Tab.Screen name="SignForPeace" component={SignForPeace} options={{ headerShown: false }} />
            }
            <Tab.Screen name="Donor" component={Donor}  />
            {/* <Tab.Screen name="Friends" component={Friends} options={{ title: "Friends", headerShown: false, tabBarShowLabel: false }} /> */}
            {/* <Tab.Screen name="Notifications" component={Notifications} options={{ headerShown: false, tabBarShowLabel: false }} /> */}
            {/* <Tab.Screen name="UserProfile" component={UserProfile}
                options={({ navigation }) => ({
                    title: 'Profile',
                    headerStyle: { backgroundColor: 'transparent' },
                    headerTintColor: 'green',
                    headerRight: () => (
                        <TouchableOpacity>
                            <Menu>
                                <MenuTrigger> */}
                                    {/* <TouchableHighlight> */}
                                    {/* <Image
                                source={require('../assets/icons/logout.png')}
                                style={{ marginRight: 15, height: 20, width: 20, tintColor: Colors.primary }}
                            /> */}
                                    {/* </TouchableHighlight> */}
                                {/* </MenuTrigger>
                                <MenuOptions>
                                    <MenuOption onSelect={() => signOut()} text='Logout' />
                                    <MenuOption onSelect={() => deleteUser()} text='Delete My Account' />
                                </MenuOptions>
                            </Menu> */}
                            
                        {/* </TouchableOpacity>
                    )
                })}
            /> */}
        </Tab.Navigator>
    );
}

export default ScholarTabs;