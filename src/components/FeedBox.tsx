import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../styles/Styles';
import Colors from '../theme/ScholarColors';
import PostBottom from './PostBottom';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { icons } from '../assets/icons';

type FeedBoxProps = {
    key: number,
    navigation?: any,
    avatar?: string,
    admin?: string,
    time?: string,
    description?: string,
    picture?: string,
    postID: string,
    userID: string
}

export default function FeedBox(props: FeedBoxProps) {
    const navigation:any=useNavigation();
    const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false);
    const [likes, setLikes] = useState<any[]>([]);
    const [comments, setComments] = useState<any[]>([]);

    const [LikeIcon, setLikeIcon] = useState(require('../assets/icons/like.png'));

    const fetchAllLikes = () => {
        firestore()
            .collection("AllPosts")
            .doc(props.userID)
            .collection("Posts")
            .doc(props.postID)
            .collection("Likes")
            .onSnapshot(snapshot => {
                const likesArray = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setLikes(likesArray);

                const userLike = likesArray.some((like: any) => like.userID === auth().currentUser?.uid);
                setIsLikedByCurrentUser(userLike);
                setLikeIcon(userLike ? require('../assets/icons/filled-like.png') : require('../assets/icons/like.png'));
            });
    }
    const fetchAllComments = () => {
        firestore()
            .collection("AllPosts")
            .doc(props.userID)
            .collection("Posts")
            .doc(props.postID)
            .collection("Comments")
            .onSnapshot(snapshot => {
                const commentsArray = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setComments(commentsArray);
                console.log("commentsArray",commentsArray);
            });
    }
    useEffect(() => {
        fetchAllComments();
        console.log("first",comments);
        fetchAllLikes();
    }, []);

    return (
        <View style={styles.post} >
            <View style={styles.postAdmin}>
                <View style={{ left: 350, top: 10, zIndex: 2, position: 'absolute' }}>
                    <TouchableOpacity>
                        <View>
                            <Image source={require('../assets/icons/dots.png')} style={{
                                height: 20, width: 20,
                                tintColor: Colors.primary
                            }} />
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={()=>navigation.navigate('User',{userID:props.userID})}>
                <View style={styles.avatarSection}>
                    {
                        props.avatar === " " || props.avatar == null ?
                        <Image source={icons.chat} style={styles.postHeaderProfile} />    
                        :
                            <Image source={{ uri: props.avatar }} style={styles.postHeaderProfile} />
                    }
                </View>
                </TouchableOpacity>
                <View style={styles.adminSection}>
                    <Text style={styles.postAdminName}>{props.admin}</Text>
                    <Text style={{ color: 'gray' }}>
                        {new Date(props.time).toLocaleDateString()}
                    </Text>
                </View>
            </View>
            <View style={styles.postDescription}>
                <Text style={styles.postDescText}>
                    {props.description}
                </Text>
            </View>
            {
                props.picture ?
                    <View style={styles.postHolder}>
                        <Image source={{ uri: props.picture }} style={{ resizeMode: 'cover', width: '100%', height: '100%' }} />
                    </View> 
                    : null
            }
            <PostBottom postID={props.postID} userID={props.userID} likes={likes} isLikedByCurrentUser={isLikedByCurrentUser} LikeIcon={LikeIcon} fetchAllLikes={fetchAllLikes} comments={comments}/>
        </View>
    );
}
