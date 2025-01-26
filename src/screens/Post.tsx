import { View, Text, Image, TouchableOpacity, TextInput, Alert, Platform, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from '../styles/Styles'

import { useNavigation } from '@react-navigation/native'
import { uploadImage } from '../services/UploadFunctions'
import { launchImageLibrary } from 'react-native-image-picker'
import { setInPost } from '../services/DataService'
import { getUserId } from '../utils/Auth'
import useUserProfileStore from '../zustand/UserProfileStore'
import { icons } from '../assets/icons'

export default function Post(navigation: any) {
    const userName = useUserProfileStore(store => store.usrName)
    const userProfilePic = useUserProfileStore(store => store.profilePic)

    const [selectedImage, setSelectedImage] = useState('');
    const [postDesc, setPostDesc] = useState('');

    const [adminId, setAdminId] = useState(getUserId());
    const [postStatus, setPostStatus] = useState('public');
    const [picName, setPicName] = useState('')
    const [filePath, setFilePath] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    navigation = useNavigation();

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
                const asset: any = response.assets[0].uri;

                const uri: any = Platform.OS === 'ios' ? asset.replace('file://', '') : asset;

                // setSelectedImage(response.assets[0].uri);
                setSelectedImage(response.assets[0].uri);
                const fName = response.assets[0].fileName;
                const path = `images/users/${adminId}/Posts/${fName}`.toString();
                setFilePath(path);
                setPicName(uri);
                console.log("pick name is :", uri)
            }
        });
    }

    const getCurrentTime = () => {
        const currentTime = new Date();
        return currentTime;
    };

    const postData = () => {
        let img = "";
        if ((selectedImage.length == 0 || selectedImage == null) && (postDesc.length == 0 || postDesc == null)) {
            Alert.alert("You cannot share an empty post");
        } else if (picName.length !== 0) {
            uploadImage(picName, filePath)
                .then((imgUrl: any) => {
                    if (isPrivate) {
                        setPostStatus("private");
                    } else {
                        setPostStatus("public");
                    }
                    const time = getCurrentTime().toString();
                    setInPost(adminId, imgUrl, postDesc, time, postStatus);
                })
                .catch(err => {
                    console.log("something went wrong!");
                })
            Alert.alert("Done!")
            navigation.goBack();
        } else {
            if (isPrivate) {
                setPostStatus("private");
            } else {
                setPostStatus("public");
            }
            const time = getCurrentTime().toString();
            setInPost(adminId, '', postDesc, time, postStatus);
            Alert.alert("Done!")
            navigation.goBack();
        }
    }

    useEffect(() => {
        console.log(userName)
        console.log(userProfilePic)
    }, [])

    return (
        <View style={[styles.container, { margin: 5 }]}>
            <KeyboardAvoidingView>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{textAlign:'center',fontSize:18}}>Topic Of the Moth</Text>
                    </View>
                    <View style={[styles.adminSection, { marginTop: 10, flexDirection: 'column' }]}>
                        
                    </View>
                </View>
                <View>
                    <TextInput
                        style={[styles.postInputStyle, { borderRadius: 10 }]}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={(text) => setPostDesc(text)}
                        placeholder="Share your Thoughts...." />
                </View>
                <View style={styles.postButtonContainer}>
                    {
                        selectedImage === '' ? null :
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity style={styles.cancelButtonStyle} onPress={() => setSelectedImage('')}>
                                    {/* <Icon name="close-outline" color={'red'} size={40} /> */}
                                <Text>Close</Text>
                                </TouchableOpacity>
                                <Image source={{ uri: selectedImage }} style={styles.selectedImageStyle}></Image>
                            </View>
                    }
                </View>
                <View style={styles.postButtonContainer}>
                    <View style={{ width: '90%' }}>
                        <TouchableOpacity onPress={postData}>
                            <Text style={styles.postButtonStyle}>Post</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.imageIconContainer}>
                        <TouchableOpacity onPress={openImagePicker}>
                            <Text>Image</Text>
                            {/* <Icon name="images-outline" size={30} color={Colors.primary} /> */}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}