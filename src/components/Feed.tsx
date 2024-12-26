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

    const fetchFeeds = async () => {
        setLoading(true);
        const userId = auth().currentUser?.uid;
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

            const friends = friendSnapshot.docs.map(doc => doc.id);
            console.log("first:",friends);
            const allPostsPromises = friends.map(async friendId => {
                const postsSnapshot = await firestore()
                    .collection("AllPosts")
                    .doc(friendId)
                    .collection("Posts")
                    .get();

                const posts = postsSnapshot.docs.map(doc => doc.data());
                console.log("posts:",posts);
                const userProfile = await firestore()
                    .collection("Users")
                    .doc(friendId)
                    .get();
                
                const userProfileData = userProfile.data();
                console.log("Profile:",userProfileData);                
                return posts.map(post => ({
                    ...post,
                    userProfile: userProfileData
                }));
            });

            const allPostsArrays = await Promise.all(allPostsPromises);
            const allPosts:any = allPostsArrays.flat();
            console.log("third:",allPosts);
            allPosts.sort((a:any, b:any) => b.time - a.time); // Assuming `postdate` is a timestamp
        
            setFeed(allPosts);
        } catch (error) {
            console.log("An error occurred", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
                        contributes={item.contributes}
                        description={item.description}
                        postID={item.postId}
                        userID={item.userProfile.userID}
                    />
                )}
            />
            }
        </View>
    )
}

export default Feed