import React, { useEffect, useState } from 'react'
import { Button, Image,ScrollView, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native'
import ScholarBanner, { ScholarMiniBanner } from '../components/UnifyBanner'
import Colors from '../theme/ScholarColors'
import useUserProfileStore from '../zustand/UserProfileStore'
import { useNavigation } from '@react-navigation/native'
import { getProfile, saveSignatures } from '../services/DataService'
import Toast from 'react-native-toast-message'
import { showSucess } from '../utils/utility'
import { getUserId } from '../utils/Auth'


const SignForPeace = () => {
    const navigation: any = useNavigation();
    const [signatures, setSignatures] = useState('');
    const userProfile: any = useUserProfileStore(store => store)
    const signPeaceTreaty = () => {
        if(signatures.length>0){
            saveSignatures(signatures);
            // getProfile(getUserId())
            setTimeout(() => {
            navigation.navigate('UserProfile');
            }, 1000);
        }
        // navigation.navigate('Certificate')
    }

    return (
        <SafeAreaView>
        <ScrollView style={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom:20}}
        >
            <ScholarMiniBanner text='Peace Treaty' />
            
            <View>
                <View style={{ flex: 1, alignItems: 'center', marginTop: 150,gap:15 }}>
                    <Text style={{ textAlign: 'center', fontSize: 28, }}>
                        I <Text style={{color:Colors.primary,fontWeight:'700'}}>{userProfile.usrName}</Text>  Sign This treaty for world peace to end war and make the world a better place
                    </Text>
                    <TextInput
                        style={{ width: '90%', textAlign: 'center',
                            padding:8, fontSize: 20, borderRadius: 20, color: Colors.primary, borderWidth: 0.4,
                        elevation:4,boxShadow:'grey',shadowOpacity:0.2
                        }}
                        placeholder='Type in Your name'
                        placeholderTextColor={'grey'}
                        onChangeText={(text)=>setSignatures(text)}
                        value={signatures}
                    ></TextInput>
                    <TouchableOpacity onPress={() => signPeaceTreaty()}>
                        <View style={{ backgroundColor: Colors.primary, padding: 10, borderRadius: 10, width: 300, alignItems: 'center' }}>
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