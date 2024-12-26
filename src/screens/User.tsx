/**
 * @file UserProfile.tsx
 * @description ?
 * @ownership Shan Ayub
 *
 * @last modified 14/10/2023
 */
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getPostLikes, fetchPosts, posts } from '../services/DataService';
import FeedBox from '../components/FeedBox';

import Colors from '../theme/ScholarColors';
import Divider from '../components/Divider';
import { useIsFocused, useRoute } from '@react-navigation/native';

import FriendBox from '../components/FriendBox';
import MissionLine from '../components/MissionLine';
import { getProfile } from '../services/DataService';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import styles from '../styles/Styles';
import { getUserId } from '../utils/Auth';
import useUserProfileStore, { useLikesStore, usePostsStore } from '../zustand/UserProfileStore';

const User = ({ navigation }: any) => {
    const isFocused = useIsFocused();
    const [userProfile, setProfileData]: any = useState(null);
    /**
     * useEffect used for loading data from DB
     */
    const allPosts = usePostsStore(store => store.posts)
    const setPostsData = usePostsStore(store => store.setAllPosts)
    const allLikes = useLikesStore(store => store.likes)
    const setAllLikes = useLikesStore(store => store.setAllLikes)
    const [friends,setFriends]=useState([]);

    /**
     * useEffect used for loading data from DB
     */
    const PostLikes = (postID: string, userID: string) => {
        var likesArray: any = [];
        getPostLikes(postID, userID).then((likes: any) => {
            likes.forEach((like: any) => {
                likesArray.push(like);
            })
        })
            .catch((error) => { console.log("error:" + error); });
        setAllLikes(likesArray);
    }

    const setAllPosts = (posts: any) => {
        let allPosts: any = [];

        posts.forEach((post: any) => {
            console.log("=>" + post.time);
            allPosts.push(post);
        })

        allPosts.map((post: any) => { console.log("unSorted posts :" + post.time); })
        const postsWithDateObjects = allPosts.map((post: any) => ({
            ...post,
            dateObject: new Date(post.time)
        }));

        // Sort the posts in descending order
        postsWithDateObjects.sort((a: any, b: any) => b.dateObject.getTime() - a.dateObject.getTime());
        setPostsData(postsWithDateObjects);
        postsWithDateObjects.map((post: any) => { console.log("Sorted posts :" + post.time); })
    }

    const extractTime = (time: string) => {
        const timestamp = new Date(time);
        const hours = timestamp.getHours();
        const minutes = timestamp.getMinutes();
        let dayOrNight = "PM";

        if (hours < 12) {
            dayOrNight = "AM"
        }

        console.log("Hours: " + hours + " minutes" + minutes);
        return (hours + ":" + minutes + " " + dayOrNight);
    }
    const countUnique=()=>{
        const uniqueResidencies:Set<string>=new Set();
        friends.forEach((friend:any) => {
            uniqueResidencies.add(friend.residency);
        });
        return uniqueResidencies.size;

    }
    const fetchAllFriends = async (userId:any) => {
        
        if (!userId) {
            console.log("No user ID found");
            return;
        }
        try {
            const friendSnapshot = await firestore()
                .collection("Users")
                .doc(userId)
                .collection("Friends")
                .get();
            console.log("here is friend snapshot:", friendSnapshot.docs);
            const frnds = friendSnapshot.docs.map(doc =>
                // console.log("first:",doc.data());
                doc.data()
            );
            console.log("here is frnd:", frnds);
            if (frnds.length > 0) {
                const friendRequestsPromises = frnds.map(async (frnd: any) => {
                    console.log("here is frnd:", frnd);
                    const senderDoc = await firestore().collection("Users").doc(frnd.friend).get();
                    console.log("here is :", senderDoc);
                    return senderDoc.data();
                });
                const requests:any = await Promise.all(friendRequestsPromises);
                console.log("Friend :", requests);
                setFriends(requests);
            }
        } catch (error) {
            console.log("An error occurred", error);
        }
    }
    useEffect(() => {
        const userID:any = route.params?.userID;
        fetchAllFriends(userID);
        getProfile(userID)
            .then((profile: any) => {
                setProfileData(profile);
                // setProfilePic(profile.profilePic);
                
            })
            .catch(error => {
                console.error('Errffor :', error);
            });
    }, [isFocused]);
    const route:any = useRoute();
    useEffect(() => {
        const userID = route.params?.userID;
        console.log("here is userID:", userID);
        fetchPosts(getUserId()).then((posts: any) => {
            setAllPosts(posts);
            console.log("all posts",allPosts);

        }).catch((err: any) => console.log("No posts"))
    }, [isFocused])

    return (
        <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:Colors.background}}>
            {
                userProfile === null ?
                    <ActivityIndicator size={35}></ActivityIndicator> :
                    <ScrollView>
                        <View style={{
                            padding: 10,
                        }}>
                            {/* Profile header */}
                            <View>
                                <View style={{  padding:10,width: '100%', backgroundColor: Colors.lightBackground, height: 150, position: 'relative' }}>
                                    <TouchableOpacity
                                        onPress={() => navigation.goBack()}>
                                        <Image source={require('../assets/icons/back.png')} style={{
                                                    height: 30, width
                                                        : 30,
                                                    tintColor: 'black',
                                                    marginTop:Platform.OS==='ios'?10:0,                                                
                                                }} />
                                    </TouchableOpacity>
                                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 50 }}>{userProfile.residency}</Text>
                                    <View style={{ justifyContent: 'center', alignItems: 'center', position: 'absolute', backgroundColor: 'transparent', height: 120, width: 120, bottom: -60, left: '50%', marginLeft: -60, borderRadius: 50 }}>
                                        {
                                            userProfile.profilePic!=="" ?
                                                <Image source={{ uri: userProfile.profilePic }} style={{
                                                    height: '100%', width
                                                        : '100%',
                                                    borderRadius: 60,
                                                    borderWidth: 5,
                                                    borderColor: Colors.primary

                                                }} /> :
                                                <Image source={require('../assets/icons/user.png')} style={{
                                                    height: 80, width
                                                        : 80,
                                                    tintColor: 'black',
                                                    borderRadius: 50,
                                                    borderWidth: 1,
                                                }} />
                                        }

                                    </View>
                                </View>
                            </View>
                            {/* Year */}
                            <View style={{ alignItems: 'center', marginTop: 55 }}>
                                <View style={{ padding: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={[styles.headingStyle]}>{userProfile.usrName}</Text>
                                    {
                                        userProfile.signed ? <Image source={require('../assets/icons/verified.png')} style={{
                                            height: 27, width
                                                : 27,
                                            borderRadius: 50,
                                            borderWidth: 1,
                                        }} />
                                            : null
                                    }
                                </View>
                                <Text
                                    style={{
                                        fontFamily: 'Just Another Hand,Inter',
                                        fontSize: 15,
                                        color: 'gray',
                                    }}>
                                    {userProfile.residency && userProfile.residency}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'column', marginTop: 10, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20, color: 'gray' }}>{friends.length}</Text>
                                    <Text style={{ fontSize: 20, color: 'gray' }}>Friends</Text>
                                </View>
                                <View style={{ flexDirection: 'column', marginLeft: 40, marginTop: 10, alignItems: 'center' }}>
                                <Text style={{ fontSize: 20, color: 'gray' }}>{countUnique()}</Text>
                                    <Text style={{ fontSize: 20, color: 'gray' }}>Flags</Text>
                                </View>
                            </View>
                            <Divider />
                            <View>
                                <Text style={styles.headingStyle}>Interest</Text>
                                <View style={{ margin: 5 }}>
                                    <Text style={styles.contentStyle}>{userProfile && userProfile.bio}</Text>
                                </View>
                            </View>
                            {/* Friends List */}
                            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}>
                                <Text style={styles.headingStyle}>Friends</Text>
                                <Text style={styles.linkStle}>See All</Text>
                            </View>
                            <View style={styles.friendBoxContainer}>
					<ScrollView horizontal={true} nestedScrollEnabled={true}>
						<View style={styles.friendBoxes}>
							{
								friends.map((friend:any,index:any)=>{
									return(
										<FriendBox key={index} data={{ friendName: friend.usrName }} profilePic={{profilePic:friend.profilePic}}/>	
								);
								})
							}
						</View>
					</ScrollView>

				</View>
                            <View>
                                <Text style={styles.headingStyle}>Posts</Text>
                            </View>
                            <View
                                style={{
                                    margin: 5,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    borderWidth: 1,
                                    borderColor: 'gray',
                                    padding: 10,
                                    borderRadius: 10,
                                }}>
                                <View>
                                    <Image source={require('../assets/icons/user.png')} style={{
                                        tintColor: Colors.primary, height: 30, width
                                            : 30
                                    }} />
                                </View>
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.push('Post', { userProfile })}>
                                    <View style={{ flex: 1, width: '80%', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text
                                            style={{ fontSize: 20 }}
                                        >Make a post...</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ marginLeft: 5 }}>
                                    <TouchableOpacity>
                                        <Icon name="image" size={35} color={Colors.primary} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <MissionLine text="World Relations" />
                            <View style={styles.container}>
                                <View style={{ padding: 10 }}>
                                    {/* <Feed /> */}
                                    <View style={{ backgroundColor: Colors.feedBackground }}>
                                        {allPosts.map((item: any, index: number) => // FIXME make sure can be indexed
                                            <FeedBox key={index} admin={userProfile.usrName} avatar={userProfile.profilePic}
                                                time={item.time}
                                                picture={item.image}
                                                likes={allLikes.length}
                                                contributes={0}
                                                description={item.description}
                                                postID={item.postId}
                                                userID={item.userID}
                                                navigation={navigation}
                                            />)
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
            }
        </View>
    );
};
export default User;
