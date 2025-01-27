import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ScholarMiniBanner } from '../components/UnifyBanner'
import Colors from '../theme/ScholarColors';
import { useNavigation } from '@react-navigation/native';
import { fetchSignedUsers } from '../services/DataService';
import BackBtn from '../components/BackBtn';

const WallOfPeace = () => {
    const [signedUsers, setSignedUsers] = useState([]);

    useEffect(() => {
        const unsubscribe = fetchSignedUsers(setSignedUsers);
        console.log("signedUsers", signedUsers);
        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
    }, []);
    const [search, setSearch] = useState('');
    const navigation: any = useNavigation();
    const goBack = () => {
        navigation.goBack();
    }
    const moveNext=(userID:any)=>{
        navigation.navigate('User',{userID:userID});
    }

    return (
        <SafeAreaView style={{backgroundColor:Colors.background}}>
            <BackBtn />
            {/* <ScholarMiniBanner text='Wall of Peace' /> */}
            <TouchableOpacity onPress={()=>navigation.navigate('PostStack')}  style={stylings.postBtn}>
                <Text>Make a Post</Text>
            </TouchableOpacity>
            <View>
                <TextInput style={stylings.searchBar} value={search} onChangeText={(text) => setSearch(text)} placeholder='search for person'>

                </TextInput>
            </View>
            <View style={{ height: '80%' }}>
                <ScrollView showsVerticalScrollIndicator>
                    {
                        signedUsers.map((person: any, index) => {
                            return (
                                person.usrName.toLowerCase().includes(search) ?
                                    <TouchableOpacity key={index} >
                                        <View  style={{ flex: 1, flexDirection: 'row', backgroundColor: Colors.lightBackground, margin: 5, padding: 10, borderRadius: 10 }}>
                                            <View style={{ flex: 1, flexDirection: 'column', padding: 5 }}>
                                                {/* <Text>Number: {index+1}</Text> */}
                                                <Text>Name: {person?.signed}</Text>
                                                <Text>Country: {person?.residency}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'column', padding: 5 }}>
                                                <Text>Date: {person?.treatyDate}</Text>
                                                
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    : null
                            );
                        })
                    }
                </ScrollView>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => goBack()}>
                        <View style={{ marginTop: 20, backgroundColor: Colors.primary, padding: 10, borderRadius: 10, width: 300, alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 20 }}>
                                Back
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default WallOfPeace
const stylings = StyleSheet.create({
    searchBar: {
        flexDirection: 'row', backgroundColor: Colors.lightBackground, margin: 5, padding: 10, borderRadius: 10, borderColor: Colors.primary, borderWidth: 2
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
    postBtn:{
   backgroundColor:Colors.primary,
   width:'80%',
   marginLeft:'10%',
   padding:10,
   borderRadius:20,
   alignItems:'center'

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