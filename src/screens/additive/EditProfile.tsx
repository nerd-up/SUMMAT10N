/**
 * @file UserProfile.tsx
 * @description ?
 * @ownership Shan Ayub
 *
 * @last modified 14/10/2023
*/

import React, { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';

import ScholarBanner from '../../components/UnifyBanner';
import { posts, setInProfile } from '../../services/DataService';
import { getUserId } from '../../utils/Auth';
import styles from '../../styles/Styles';
import { Fonts } from '../../theme/Fonts';
import Colors from '../../theme/ScholarColors';
import { uploadImage } from '../../services/UploadFunctions';
import { launchImageLibrary } from 'react-native-image-picker';
import useUserProfileStore from '../../zustand/UserProfileStore';
import { icons } from '../../assets/icons';

/**
 * @description This screen is an additive screen
 */
const EditProfile = () => {
    // getting data from navigation props
    // Purpose: so we can show user it's previous details in fields
    // This will eventually be replaced by redux
    const userProfile = useUserProfileStore(store => store)

    const [name, setName] = useState(userProfile.usrName);
    const [signed, setSigned] = useState("");

    
    const [citizenShip, setCitizenShip] = useState("");
    const [major, setMajor] = useState(userProfile.Class);
    const [bio, setBio] = useState(userProfile.bio);
    const [profilePic, setProfilePic] = useState(userProfile.profilePic);
    const navigation = useNavigation();

    const userId = getUserId();

    /**
     * updating information
     */
    function setChanges() {
        if (name.length == 0) {
            Alert.alert('Name cannot be Empty!');
        } else {
            console.log("till here everything is okay!")
            setInProfile(userId, bio, profilePic, citizenShip, name,signed);
            Alert.alert('Updated!');
            navigation.goBack();
        }
    }

    const openImagePicker = () => {
        const options: any = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        launchImageLibrary(options, (response: any) => {
            if (response.didCancel) {
                console.log('Image picker was canceled');
            } else if (response.error) {
                console.error('Image picker error:', response.error);
            } else {
                // Handle the selected image here

                const uri = response.assets[0].uri;
                const fileName = response.assets[0].fileName;
                const path = `images/users/${userId}/profilePictures/${fileName}`.toString();
                uploadImage(uri, path)
                    .then((imgUrl: any) => {
                        setProfilePic(imgUrl);
                    })
                    .catch(() => {
                        console.log("something went wrong!");
                    })
            }
        });
    };

    return (
        <View style={{ flex:1,alignContent: 'center', justifyContent: 'center' }}>
            <View
                style={{
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignItems: 'center',
                }}>
                {
                    profilePic.length == 0 ?
                    <Image style={styles.profilePictur} source={icons.chat} />

                        :
                        <Image style={styles.profilePictur} source={{ uri: profilePic }} />
                }
            </View>
            <View style={{ alignItems: 'center', margin: 10 }}>
                <TouchableOpacity onPress={openImagePicker}>
                    <Text
                        style={{
                            fontFamily: Fonts.regular,
                            color: Colors.linkColor,
                            fontSize: 16,
                        }}>
                        Edit Profile picture
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{ margin: 10 }}>
                <View style={{ margin: 5 }}>
                    <TextInput
                        style={{ backgroundColor: Colors.background, fontSize: 18 }}
                        value={name}
                        placeholder="Your Name"
                        onChangeText={text => setName(text)}></TextInput>
                </View>
                <View style={{ margin: 5 }}>
                    <TextInput
                        style={{ backgroundColor: Colors.background, fontSize: 18 }}
                        value={citizenShip}
                        placeholder="Your Country"
                        onChangeText={text => setCitizenShip(text)}></TextInput>
                </View>
                <View style={{ margin: 5 }}>
                    <TextInput
                        style={{
                            backgroundColor: Colors.background,
                            borderBottomColor: Colors.secondary,
                            fontSize: 18,
                        }}
                        value={bio}
                        placeholder="Bio"
                        onChangeText={text => setBio(text)}></TextInput>
                </View>
            </View>
            <View
                style={{
                    alignContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                    margin: 20,
                }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: Colors.primary,
                        width: '50%',
                        padding: 10,
                        borderRadius: 10,
                        alignItems: 'center',
                    }}
                    onPress={setChanges}>
                    <Text style={{ color: Colors.text }}>Apply Changes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default EditProfile;
