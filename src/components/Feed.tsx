import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import FeedBox from '../components/FeedBox';
import { posts } from '../services/DataService';
import Colors from '../theme/ScholarColors';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
type FeedProps = {
    scrollEnabled?: boolean,
    startReachedThreshold?: number,
    endReachedThreshold?: number,
    onStartReached?: () => void,
    onEndReached?: () => void,
}

const Feed = (props: FeedProps) => {
    const [feed, setFeed]:any = useState([]);
    const [loading, setLoading] = useState(true);

    function onStartReachedCallback() {
        if (props.onStartReached !== undefined)
            props.onStartReached();
    }

    function onEndReachedCallback() {
        if (props.onEndReached !== undefined)
            props.onEndReached();
    }

    // const fetchFeeds = async () => {
    //     setLoading(true);
    //     const userId = auth().currentUser?.uid;
    //     if (!userId) {
    //         console.log("No user ID found");
    //         return;
    //     }

    //     try {
    //         const friendSnapshot = await firestore()
    //             .collection("Users")
    //             .doc(userId)
    //             .collection("Friends")
    //             .get();

    //         const friends = friendSnapshot.docs.map(doc => doc.id);
    //         console.log("first:",friends);
    //         const allPostsPromises = friends.map(async friendId => {
    //             const postsSnapshot = await firestore()
    //                 .collection("AllPosts")
    //                 .doc(friendId)
    //                 .collection("Posts")
    //                 .get();

    //             const posts = postsSnapshot.docs.map(doc => doc.data());
    //             console.log("posts:",posts);
    //             const userProfile = await firestore()
    //                 .collection("Users")
    //                 .doc(friendId)
    //                 .get();
                
    //             const userProfileData = userProfile.data();
    //             console.log("Profile:",userProfileData);                
    //             return posts.map(post => ({
    //                 ...post,
    //                 userProfile: userProfileData
    //             }));
    //         });

    //         const allPostsArrays = await Promise.all(allPostsPromises);
    //         const allPosts:any = allPostsArrays.flat();
    //         console.log("third:",allPosts);
    //         allPosts.sort((a:any, b:any) => b.time - a.time); // Assuming `postdate` is a timestamp
        
    //         setFeed(allPosts);
    //     } catch (error) {
    //         console.log("An error occurred", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const fetchFeeds = async () => {
        setLoading(true);
      


        try {
          // Fetch all user IDs from "AllPosts" collection
          const userPostsSnapshot = await firestore().collection("users").get();
          console.log("userPostsSnapshot:",userPostsSnapshot);
          const allPostsPromises = userPostsSnapshot.docs.map(async userDoc => {
            const userId = userDoc.id;
            console.log(userId);
            // Fetch all posts for the user
            const postsSnapshot = await firestore()
              .collection("AllPosts")
              .doc(userId)
              .collection("Posts")
              .get();
            const posts = postsSnapshot.docs.map(doc => doc.data());
            console.log(posts);
            // Fetch the user's profile
            const userProfile = await firestore()
              .collection("users")
              .doc(userId)
              .get();
      
            const userProfileData = userProfile.data();
      
            // Attach user profile data to each post
            return posts.map(post => ({
              ...post,
              userProfile: userProfileData,
            }));
          });
      
          // Await all promises and flatten the results
          const allPostsArrays = await Promise.all(allPostsPromises);
          const allPosts: any = allPostsArrays.flat();
      
          // Sort the posts by time (assuming `time` is a timestamp)
          allPosts.sort((a: any, b: any) => b.time - a.time);
          console.log(allPosts);
          setFeed(allPosts);
        } catch (error) {
          console.error("An error occurred while fetching posts:", error);
        } finally {
          setLoading(false);
        }
      };
      
    useEffect(() => {
        console.log("iamhere");
        fetchFeeds();
    }, []);

    
   
    return (
        <View style={{ backgroundColor: Colors.lightBackground ,alignItems:'center',justifyContent:'center'}}>
            {
                loading===true?
                <ActivityIndicator
                size={'large'}
                color={Colors.primary}
                ></ActivityIndicator>:
                <FlatList

                onStartReached={onStartReachedCallback}
                onStartReachedThreshold={0.01}

                onEndReached={onEndReachedCallback}
                onEndReachedThreshold={0.01}

                showsVerticalScrollIndicator={false}
                scrollEnabled={props.scrollEnabled}
                data={feed}
                renderItem={({ item }) => (

                    <FeedBox key={0} admin={item.userProfile.usrName} avatar={item.userProfile.profilePic}
                        time={item.time}
                        picture={item.image}
                        likes={item.likes}
                        topic={item?.topic}
                        residency={item?.userProfile?.residency}
                        contributes={item.contributes}
                        description={item.text}
                        postID={item?.postId}
                        userID={item?.userProfile?.userID}
                    />
                )}
            />
            }
        </View>
    )
}

export default Feed