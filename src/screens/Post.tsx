// import { View, Text, Image, TouchableOpacity, TextInput, Alert, Platform, KeyboardAvoidingView } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import styles from '../styles/Styles'

// import { useNavigation } from '@react-navigation/native'
// import { uploadImage } from '../services/UploadFunctions'
// import { launchImageLibrary } from 'react-native-image-picker'
// import { setInPost } from '../services/DataService'
// import { getUserId } from '../utils/Auth'
// import useUserProfileStore from '../zustand/UserProfileStore'
// import { icons } from '../assets/icons'

// export default function Post(navigation: any) {
//     const userName = useUserProfileStore(store => store.usrName)
//     const userProfilePic = useUserProfileStore(store => store.profilePic)

//     const [selectedImage, setSelectedImage] = useState('');
//     const [postDesc, setPostDesc] = useState('');

//     const [adminId, setAdminId] = useState(getUserId());
//     const [postStatus, setPostStatus] = useState('public');
//     const [picName, setPicName] = useState('')
//     const [filePath, setFilePath] = useState('');
//     const [isPrivate, setIsPrivate] = useState(false);
//     navigation = useNavigation();


//     const getCurrentTime = () => {
//         const currentTime = new Date();
//         return currentTime;
//     };

//     const postData = () => {
//         let img = "";
//         if ((selectedImage.length == 0 || selectedImage == null) && (postDesc.length == 0 || postDesc == null)) {
//             Alert.alert("You cannot share an empty post");
//         } else if (picName.length !== 0) {
//             uploadImage(picName, filePath)
//                 .then((imgUrl: any) => {
//                     if (isPrivate) {
//                         setPostStatus("private");
//                     } else {
//                         setPostStatus("public");
//                     }
//                     const time = getCurrentTime().toString();
//                     setInPost(adminId, imgUrl, postDesc, time, postStatus);
//                 })
//                 .catch(err => {
//                     console.log("something went wrong!");
//                 })
//             Alert.alert("Done!")
//             navigation.goBack();
//         } else {
//             if (isPrivate) {
//                 setPostStatus("private");
//             } else {
//                 setPostStatus("public");
//             }
//             const time = getCurrentTime().toString();
//             setInPost(adminId, '', postDesc, time, postStatus);
//             Alert.alert("Done!")
//             navigation.goBack();
//         }
//     }

//     useEffect(() => {
//         console.log(userName)
//         console.log(userProfilePic)
//     }, [])

//     return (
//         <View style={[styles.container, { margin: 5 }]}>
//             <KeyboardAvoidingView>
//                 <View style={{ flexDirection: 'column', alignItems: 'center', padding: 5, gap: 20 }}>
//                     <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                         <Text style={{ textAlign: 'center', fontSize: 18 }}>Topic Of the Moth</Text>
//                     </View>
//                     <View style={[styles.adminSection, { marginTop: 10, flexDirection: 'column' }]}>
//                         <Text>topic here</Text>
//                     </View>
//                     <View style={{}}>
//                         <TouchableOpacity onPress={postData}>
//                             <Text style={styles.postButtonStyle}>View More...</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//                 <View>
//                     <View style={[styles.adminSection, { marginTop: 10, flexDirection: 'column' }]}>
//                         <Text>Share your thoughts</Text>
//                     </View>
//                     <TextInput
//                         style={[styles.postInputStyle, { borderRadius: 10,padding:10 }]}
//                         multiline={true}
//                         numberOfLines={4}
//                         value='starts with topic title'
//                         onChangeText={(text) => setPostDesc(text)}
//                         // placeholder="Share your Thoughts...."
//                         />
//                 </View>
//                 <View style={styles.postButtonContainer}>
//                     <View style={{ flex: 1 }}>
//                         <TouchableOpacity onPress={postData}>
//                             <Text style={styles.postButtonStyle}>Post</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </KeyboardAvoidingView>
//         </View>
//     )
// }
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    Alert,
    KeyboardAvoidingView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Styles';
import { useNavigation } from '@react-navigation/native';
import { uploadImage } from '../services/UploadFunctions';
import { setInPost } from '../services/DataService';
import { getUserId } from '../utils/Auth';
import useUserProfileStore from '../zustand/UserProfileStore';
import { Toast } from 'react-native-alert-notification';

// Array of peace topics
const peaceTopics = [
    {
        month: "January",
        topic: "Causes of War",
        description: "Explore the political, economic, and cultural factors that lead to the outbreak of wars."
    },
    {
        month: "February",
        topic: "The Role of Diplomacy in Peacebuilding",
        description: "Discuss how diplomatic efforts and negotiations can prevent conflicts and promote harmony."
    },
    {
        month: "March",
        topic: "Impact of War on Civilians",
        description: "Examine how wars affect civilian populations, leading to displacement and loss of life."
    },
    {
        month: "April",
        topic: "Education as a Tool for Peace",
        description: "Understand how access to education can reduce violence and foster understanding between communities."
    },
    {
        month: "May",
        topic: "Cultural Understanding and Peace",
        description: "Discuss how celebrating cultural diversity can reduce prejudices and conflicts."
    },
    {
        month: "June",
        topic: "Economic Inequality and Conflict",
        description: "Explore the role of economic disparities in fueling tensions and how addressing them can promote peace."
    },
    {
        month: "July",
        topic: "The Role of Women in Peace Processes",
        description: "Highlight how women's participation in peace negotiations leads to sustainable resolutions."
    },
    {
        month: "August",
        topic: "Youth Empowerment for Peace",
        description: "Discuss the importance of engaging young people in peacebuilding efforts to create a better future."
    },
    {
        month: "September",
        topic: "The Media's Role in Promoting Peace",
        description: "Analyze how responsible journalism can contribute to conflict resolution and counter hate speech."
    },
    {
        month: "October",
        topic: "Environmental Conflicts and Peace",
        description: "Understand how environmental degradation and resource scarcity lead to conflicts and how conservation efforts promote peace."
    },
    {
        month: "November",
        topic: "The Psychology of Peace and Conflict",
        description: "Explore the psychological factors that influence human behavior in conflicts and cooperation."
    },
    {
        month: "December",
        topic: "Global Cooperation for World Peace",
        description: "Discuss the importance of international organizations and agreements in maintaining global peace."
    }
];


// Get the current month topic
const getCurrentMonthTopic = () => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    return peaceTopics.find((topic) => topic.month === currentMonth) || { topic: '', description: '' };
};

export default function Post() {
    const userName = useUserProfileStore((store) => store.usrName);
    const userProfilePic = useUserProfileStore((store) => store.profilePic);

    const [selectedImage, setSelectedImage] = useState('');
    const [postDesc, setPostDesc] = useState('');
    const [adminId] = useState(getUserId());
    const [postStatus, setPostStatus] = useState('public');
    const [isPrivate, setIsPrivate] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const { topic, description } = getCurrentMonthTopic();
    const getCurrentTime = () => new Date().toString();
    const postData = async () => {
        if (!postDesc.trim()) {
            Alert.alert('You cannot share an empty post');
            return;
        }
        try {
            const time = getCurrentTime();
            const post = {
                adminId,
                text: postDesc,
                time,
                topic,
            };
            await setInPost(post);
            Alert.alert('Post shared successfully!');
            navigation.goBack();
        } catch (error) {
            if (error.message === 'You can only make one post per month.') {
                Alert.alert('You have already made a post this month.');
            } else {
                // console.error('Error posting:', error);
                Alert.alert('Failed to post. Please try again.');
            }
        }
    };
    return (
        <View style={[styles.container, { margin: 5 }]}>
            <KeyboardAvoidingView>
                <View style={{ flexDirection: 'column', alignItems: 'center', padding: 5, gap: 20 }}>
                    {/* Topic Section */}
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', fontSize: 18 }}>Topic of the Month</Text>
                    </View>
                    <View style={[styles.adminSection, { marginTop: 10, flexDirection: 'column' }]}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{topic}</Text>
                    </View>

                    {/* View More Button */}
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Text style={styles.postButtonStyle}>View More...</Text>
                    </TouchableOpacity>
                </View>

                {/* Share Thoughts */}
                <View>
                    <View style={[styles.adminSection, { marginTop: 10, flexDirection: 'column' }]}>
                        <Text>Share your thoughts</Text>
                    </View>
                    <TextInput
                        style={[styles.postInputStyle, { borderRadius: 10, padding: 10 }]}
                        multiline={true}
                        numberOfLines={4}
                        placeholder={`Start with "${topic}"`}
                        onChangeText={(text) => setPostDesc(text)}
                    />
                </View>

                {/* Post Button */}
                <View style={styles.postButtonContainer}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={postData}>
                            <Text style={styles.postButtonStyle}>Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

            {/* Modal for Description */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{topic}</Text>
                        <Text style={{ marginTop: 10 }}>{description}</Text>
                        <TouchableOpacity
                            style={[styles.modalButton, { marginTop: 20 }]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={{ color: 'white' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
