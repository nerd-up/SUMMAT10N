import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import styles from '../styles/Styles';
import PostBottom from './PostBottom';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import Report from './Report';
import { deletePost } from '../services/DataService';
type FeedBoxProps = {
    key: number,
    navigation?: any,
    avatar?: string,
    admin?: string,
    time?: string,
    residency?: string,
    description?: string,
    picture?: string,
    postID: string,
    isSubscribed?: boolean,
    userID: string
}
export default function FeedBox(props: FeedBoxProps) {
    const navigation: any = useNavigation();
    const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false);
    const [likes, setLikes] = useState<any[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    const [isReportOpen,setIsReportOpen]=useState(false);
    const [LikeIcon, setLikeIcon] = useState(require('../assets/icons/like.png'));
    const setReportOpen=()=>{
        if(isReportOpen){
            setIsReportOpen(false);
        }else{
            setIsReportOpen(true);
        }
    }
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
                console.log("commentsArray", commentsArray);
            });
    }
    useEffect(() => {
        fetchAllComments();
        console.log("first", comments);
        fetchAllLikes();
    }, []);
    useEffect(()=>{

    },[isReportOpen]);
  
    return (
        <View style={styles.post} >
            <Report postDetails={props} setIsVisible={setIsReportOpen} isVisible={isReportOpen}/>
            <View style={styles.postAdmin}>
                <View style={{ top: 10, right: 0, zIndex: 2, position: 'absolute' }}>
                    <Menu>
                        <MenuTrigger>
                            <Image source={require('../assets/icons/dots.png')} style={{ height: 20, width: 20, tintColor: 'black' }} />
                        </MenuTrigger>
                        <MenuOptions>
                            {auth().currentUser?.uid === props?.userID ?
                                <>
                                    {/* <MenuOption onSelect={() => navigation.navigate('EditPost', { postID: props.postID })} text='Edit Post' /> */}
                                    <MenuOption onSelect={() => deletePost(props?.userID, props?.postID)} text='Delete Post' />
                                </>
                                : <MenuOption onSelect={()=>setReportOpen()} text='Report Post' />
                            }
                        </MenuOptions>
                    </Menu>
                </View>
                <View style={{ left: 0, top: 10, zIndex: 2, position: 'absolute' }}>
                    <Text style={{ color: 'gray' }}>
                        {new Date(props.time).toLocaleDateString()}
                    </Text>
                </View>
                <View style={[styles.adminSection, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={styles.postAdminName}>{props.admin}</Text>
                    <Text style={[styles.postAdminName, { color: 'gray' }]}>{props.residency}</Text>
                    <Text style={[styles.postAdminName, { color: 'gray' }]}>{props.topic}</Text>

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
            <PostBottom 
                // isSubscribed={props.isSubscribed}
             postID={props.postID} userID={props.userID} likes={likes} isLikedByCurrentUser={isLikedByCurrentUser} LikeIcon={LikeIcon} fetchAllLikes={fetchAllLikes} comments={comments} />
        </View>
    );
}
