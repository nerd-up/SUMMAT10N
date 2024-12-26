import React, { useEffect, useState } from 'react'
import { View, TextInput, ScrollView, StyleSheet, Text, TouchableOpacity, Image, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../theme/ScholarColors'
import { getUsers } from '../services/DataService'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native'
const FindFriends = () => {
    const navigation: any = useNavigation();
    const [users, setUsers] = useState([]);
    const [showLoading, setShowLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [popUpVisibility, setPopUpVisibility] = useState(false);

    const toggleVisibility = () => {
        if (popUpVisibility == false) {
            setPopUpVisibility(true);
        } else {
            setPopUpVisibility(false);
        }
    }
    const sendRequest = async (receiver: any, sender: any) => {
        const requestRef = firestore()
            .collection("Users")
            .doc(receiver)
            .collection("FriendRequests")
            .doc(sender); // Create the document with the sender's ID
        await requestRef.set({
            sender: sender,
            receiver: receiver,
            date: new Date().toISOString(),
        }).then(res => {
            console.log("here is response", res);
        }).catch(err => {
            console.log("an error occurred", err);
        })
    }
    const getAllUsers = async () => {
        await firestore()
            .collection("Users")
            .get()
            .then(querySnapshot => {
                const allUsers: any = [];
                querySnapshot.forEach(documentSnapshot => {
                    allUsers.push(documentSnapshot.data());
                });
                setUsers(allUsers);
            }).catch(error => {
                console.log("an Error occurred: ", error);
            })
        // Wait for all profile subcollection queries to complete
    };
    const moveNext = (userID: any) => {
        navigation.navigate('User', { userID: userID });
    }
    useEffect(() => {
        getAllUsers();
    }, [users])
    return (
        <View >
            <View style={stylings.searchBar}>
                <TextInput style={stylings.searchBarInput} value={search} onChangeText={(text) => setSearch(text)} placeholder='Find Friends...'>
                </TextInput>
            </View>
            <ScrollView>
                <View style={stylings.classmatesList}>
                    {
                        users.map((user: any, index: any) => {
                            return (
                                user.usrName.toLowerCase().includes(search.toLowerCase()) ?
                                    <View style={stylings.classmate} key={index}>
                                        <TouchableOpacity onPress={()=>moveNext(user.userID)}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={stylings.classmateIcon}>
                                                    {
                                                        user.profilePic && user.profilePic !== " " ?
                                                            <Image source={{ uri: user.profilePic }} style={{ height: 60, width: 60, borderRadius: 50 }}></Image>
                                                            :
                                                            <Icon name='person' size={55} color={Colors.primary} style={{ height: 60, width: 60, borderRadius: 50 }}/>
                                                    }
                                                </View>
                                                <View style={stylings.classmateTexts}>
                                                    <Text style={stylings.classmateName}>
                                                        {user.usrName}
                                                    </Text>
                                                    <Text style={stylings.classmateSchool}>
                                                        {user.bio}
                                                    </Text>
                                                    <Text>
                                                        {user.residency}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        {
                                            user.userID === auth().currentUser?.uid ?
                                                null :
                                                <View >
                                                    <TouchableOpacity onPress={() => sendRequest(user.userID, auth().currentUser?.uid)}>
                                                        <View style={stylings.acceptButton}>
                                                            <Image style={stylings.icon} source={require('../assets/icons/add-friend.png')}></Image>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                        }

                                    </View>
                                    :
                                    null
                            );
                        })
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default FindFriends
const stylings = StyleSheet.create({
    searchBar: {
        margin: 5,
        padding: 5,
        justifyContent: 'center',
    },
    searchBarInput: {
        marginLeft: 8,
        marginRight: 8,
        padding: 5,
        backgroundColor: Colors.lightBackground,
        fontSize: 15,
        borderRadius: 10,
    }
    ,
    classmatesList: {
        margin: 5,
        padding: 5,
    },
    classmate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        margin: 4,
        backgroundColor: Colors.lightBackground,
        borderRadius: 5
    },
    classmateName: {
        color: Colors.primary,
        fontWeight: 'bold'
    },
    classmateIcon: {
        borderRadius: 50,
    },
    classmateSchool: {
        color: Colors.text,

    },
    classmateTexts: {
        marginLeft: 9,
        padding: 2,
    },
    dots: {
        marginLeft: 95,

    },
    acceptButton: {
        padding: 10,

        borderRadius: 10,
    },
    icon: {
        fontSize: 16,
        color: "white",
        tintColor: Colors.primary,
        height: 30,
        width: 30
    }
})

