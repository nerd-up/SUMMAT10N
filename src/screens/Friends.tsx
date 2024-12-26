/**
 * @file Friends.tsx
 * @description ?
 * @ownership ?
 * @last modified 9/20/2023
 */
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';

import styles from '../styles/Styles';
import { ScholarMiniBanner } from '../components/UnifyBanner';
import Divider from '../components/Divider';
import Colors from '../theme/ScholarColors';
import PopUp from '../components/PopUp';
import Modal from "react-native-modal";
import AllFriends from '../components/AllFriends';
import FriendRequests from '../components/FriendRequests';
import FindFriends from '../components/FindFriends';
import { useRoute } from '@react-navigation/native';
const Friends = ({ navigation}: any,props:any ) => {
    const router:any=useRoute();
    console.log("first:",router.params?.selectedOption);
    const [selectedOption,setSelectedOption] =useState(router.params?.selectedOption==="Your Friends"?router.params?.selectedOption:"Friend Requests");
    const [search, setSearch] = useState('');

    const [popUpVisibility, setPopUpVisibility] = useState(false);
    const toggleVisibility = () => {
        if (popUpVisibility == false) {
            setPopUpVisibility(true);
        } else {
            setPopUpVisibility(false);
        }
    }
    useEffect(() => {
        console.log("Search is now ", search);
    }, [popUpVisibility, search,selectedOption]);
    return (
        <View style={styles.container}>
            {
                popUpVisibility ? <PopUp func={toggleVisibility}/>
                    : null
            }
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <ScholarMiniBanner text="Friends" size={49} />
            </View>
            <Divider />
            <View style={{flexDirection:'row',justifyContent:'space-between',margin:10,padding:10}}>
                <TouchableOpacity onPress={()=>setSelectedOption("Friend Requests")}>
                    <View style={selectedOption==="Friend Requests"?{backgroundColor:Colors.primary,padding:10,borderRadius:20}:{backgroundColor:"gray",padding:10,borderRadius:20}}>
                        <Text style={{color:"black"}}>
                            Friend Requests
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setSelectedOption("Suggestions")}>
                <View style={selectedOption==="Suggestions"?{backgroundColor:Colors.primary,padding:10,borderRadius:20}:{backgroundColor:"gray",padding:10,borderRadius:20}}>
                        <Text style={{color:"black"}}>
                            Suggestions
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setSelectedOption("Your Friends")}>
                <View style={selectedOption==="Your Friends"?{backgroundColor:Colors.primary,padding:10,borderRadius:20}:{backgroundColor:"gray",padding:10,borderRadius:20}}>
                        <Text style={{color:"black"}}>
                            Your Friends
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            {
                selectedOption==="Your Friends"?
                <AllFriends/>:null
            }
            {
                selectedOption==="Friend Requests"?
                <FriendRequests/>:null
            }
            {
                selectedOption==="Suggestions"?
                <FindFriends/>:null
            }
        </View>
    )

}

export default Friends;
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
    citizenshipStyle: {

    }
})

