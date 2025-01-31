import React, { useEffect, useState } from 'react'
import { Button, Image,ScrollView, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native'
import ScholarBanner, { ScholarMiniBanner } from '../components/UnifyBanner'
import Colors from '../theme/ScholarColors'
import useUserProfileStore from '../zustand/UserProfileStore'
import { useNavigation } from '@react-navigation/native'
import { saveSignatures } from '../services/DataService'
import Toast from 'react-native-toast-message'


const SignForPeace = () => {
    const navigation: any = useNavigation();
    const [signatures, setSignatures] = useState('');
    const userProfile: any = useUserProfileStore(store => store)
    const signPeaceTreaty = () => {
        if(signatures.length>0){
            saveSignatures(signatures);
            Toast.show({
                text1:"Congrats🥳!!",
                text2:"Piece of treaty is signed"
            })
        }
        navigation.navigate('Certificate')
    }

    return (
        <SafeAreaView>
        <ScrollView style={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom:20}}
        >
            <ScholarMiniBanner text='Peace Treaty' />
            
            <View>
                <View style={{ flex: 1, alignItems: 'center', marginTop: 150 }}>
                    <Text style={{ textAlign: 'center', fontSize: 28, }}>
                        I "{userProfile.usrName}" Sign This treaty for world peace to end war and make the world a better place
                    </Text>
                    <TextInput
                        style={{ width: 350, textAlign: 'center', fontSize: 20, borderRadius: 10, color: Colors.primary, borderWidth: 1, }}
                        placeholder='Type in Your name'
                        onChangeText={(text)=>setSignatures(text)}
                        value={signatures}
                    ></TextInput>
                    <TouchableOpacity onPress={() => signPeaceTreaty()}>
                        <View style={{ marginTop: 20, backgroundColor: Colors.primary, padding: 10, borderRadius: 10, width: 300, alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 20 }}>
                                Submit
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
        </SafeAreaView>
    )
}

export default SignForPeace