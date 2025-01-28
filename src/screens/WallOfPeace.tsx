import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ScholarMiniBanner } from '../components/UnifyBanner'
import Colors from '../theme/ScholarColors';
import { useNavigation } from '@react-navigation/native';
import { fetchSignedUsers } from '../services/DataService';
import BackBtn from '../components/BackBtn';
import WinnersModal from '../components/WinnerModal';
import firestore from '@react-native-firebase/firestore';
const WallOfPeace = () => {
    const [signedUsers, setSignedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [monthlyWinner, setMonthlyWinner] = useState(null);
    const [yearlyWinner, setYearlyWinner] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const unsubscribe = fetchSignedUsers(setSignedUsers);
        console.log("signedUsers", signedUsers);
        // Clean up the subscription when the component unmounts
        return () => unsubscribe();
    }, []);
    useEffect(() => {
        fetchWinners();
    }, []);
    const navigation: any = useNavigation();
    const goBack = () => {
        navigation.goBack();
    }
    // const fetchWinners = async () => {
    //     try {
    //         const allUsersSnapshot = await firestore().collection("AllPosts").get(); // Fetch all users who have posts
    //         let monthly = { likes: 0 };
    //         let yearly = { likes: 0 };
    //         console.log("allUsersSnapshot:",allUsersSnapshot);
    //         for (const userDoc of allUsersSnapshot.docs) {
    //             const userId = userDoc.id;

    //             // Fetch user details (e.g., name, country)
    //             const userDetailsSnapshot = await firestore().collection("Users").doc(userId).get();
    //             const userDetails = userDetailsSnapshot.data();

    //             // Fetch posts for the current user
    //             const userPostsSnapshot = await firestore()
    //                 .collection("AllPosts")
    //                 .doc(userId)
    //                 .collection("Posts")
    //                 .get();

    //             userPostsSnapshot.forEach((postDoc) => {
    //                 const post = postDoc.data();
    //                 const postDate = new Date(post?.time); // Assuming each post has a `time` field
    //                 const currentMonth = new Date().getMonth();
    //                 const currentYear = new Date().getFullYear();

    //                 // Calculate monthly and yearly winners
    //                 if (postDate.getMonth() === currentMonth && post.likes > monthly.likes) {
    //                     monthly = { ...post, ...userDetails, postId: postDoc.id }; // Add user details
    //                 }
    //                 if (postDate.getFullYear() === currentYear && post.likes > yearly.likes) {
    //                     yearly = { ...post, ...userDetails, postId: postDoc.id }; // Add user details
    //                 }
    //             });
    //         }

    //         console.log("Monthly Winner:", monthly);
    //         console.log("Yearly Winner:", yearly);

    //         setMonthlyWinner(monthly);
    //         setYearlyWinner(yearly);
    //     } catch (error) {
    //         console.error("Error fetching winners:", error);
    //     }
    // );
    const fetchWinners = async () => {
        setLoading(true);
        try {
            // Fetch all user IDs from the "users" collection
            const userPostsSnapshot = await firestore().collection("users").get();

            if (userPostsSnapshot.empty) {
                console.warn("No users found in the database.");
                setMonthlyWinner(null);
                setYearlyWinner(null);
                setLoading(false);
                return;
            }

            const allPostsPromises = userPostsSnapshot.docs.map(async (userDoc) => {
                const userId = userDoc.id;
                console.log("for userId:", userId);
                try {
                    // Fetch all posts for the user
                    const postsSnapshot = await firestore()
                        .collection("AllPosts")
                        .doc(userId)
                        .collection("Posts")
                        .get();

                    const posts = postsSnapshot.docs.map(async (postDoc) => {
                        const postId = postDoc.id;
                        const postData = postDoc.data();

                        // Count the number of likes for this post
                        const likesSnapshot = await firestore()
                            .collection("AllPosts")
                            .doc(userId)
                            .collection("Posts")
                            .doc(postId)
                            .collection("Likes")
                            .get();

                        const likesCount = likesSnapshot.size;

                        return {
                            ...postData,
                            postId,
                            userId,
                            likes: likesCount,
                        };
                    });

                    const resolvedPosts = await Promise.all(posts);

                    // Fetch the user's profile
                    const userProfileDoc = await firestore()
                        .collection("users")
                        .doc(userId)
                        .get();

                    const userProfile = userProfileDoc.exists ? userProfileDoc.data() : null;

                    return resolvedPosts.map((post) => ({
                        ...post,
                        userProfile,
                    }));
                } catch (error) {
                    console.error(`Error fetching posts for userId ${userId}:`, error);
                    return [];
                }
            });

            const allPostsArrays = await Promise.all(allPostsPromises);
            const allPosts = allPostsArrays.flat();

            if (allPosts.length === 0) {
                console.warn("No posts found in the database.");
                setMonthlyWinner(null);
                setYearlyWinner(null);
                setLoading(false);
                return;
            }

            // Get the current date, month, and year
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            // Filter and compute monthly and yearly winners
            let monthlyWinner = { likes: 0 };
            let yearlyWinner = { likes: 0 };

            allPosts.forEach((post) => {
                const postDate = new Date(post.time); // Assuming `time` is a timestamp
                const postLikes = post.likes || 0;

                // Check for monthly winner
                if (
                    postDate.getMonth() === currentMonth &&
                    postDate.getFullYear() === currentYear &&
                    postLikes > monthlyWinner.likes
                ) {
                    monthlyWinner = { ...post };
                }

                // Check for yearly winner
                if (postDate.getFullYear() === currentYear && postLikes > yearlyWinner.likes) {
                    yearlyWinner = { ...post };
                }
            });

            // Set winners
            console.log("Monthly Winner:", monthlyWinner);
            console.log("Yearly Winner:", yearlyWinner);

            setMonthlyWinner(monthlyWinner.likes > 0 ? monthlyWinner : null);
            setYearlyWinner(yearlyWinner.likes > 0 ? yearlyWinner : null);
        } catch (error) {
            console.error("Error fetching winners:", error);
        } finally {
            setLoading(false);
        }
    };


    const moveNext = (userID: any) => {
        navigation.navigate('User', { userID: userID });
    }
    return (
        <SafeAreaView style={{ backgroundColor: Colors.background }}>
            <BackBtn />
            {/* <ScholarMiniBanner text='Wall of Peace' /> */}
            {/* <TouchableOpacity onPress={()=>navigation.navigate('PostStack')}  style={stylings.postBtn}>
                <Text>Make a Post</Text>
            </TouchableOpacity> */}
            <View style={stylings.header}>
                <Text style={stylings.headerText}>Wall of Peace</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image
                        source={require('../assets/icons/trophy.png')}
                        style={stylings.trophyIcon}
                    />
                </TouchableOpacity>
            </View>
            <View>
                <TextInput style={stylings.searchBar} value={search} onChangeText={(text) => setSearch(text)} placeholder='search for person'>

                </TextInput>
            </View>
            <View style={{ height: '80%' }}>
                <ScrollView showsVerticalScrollIndicator>
                    {
                        signedUsers.map((person: any, index) => {
                            return (
                                person.usrName.toLowerCase().includes(search) ?
                                    <TouchableOpacity key={index} >
                                        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: Colors.lightBackground, margin: 5, padding: 10, borderRadius: 10 }}>
                                            <View style={{ flex: 1, flexDirection: 'column', padding: 5 }}>
                                                {/* <Text>Number: {index+1}</Text> */}
                                                <Text>Name: {person?.signed}</Text>
                                                <Text>Country: {person?.residency}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'column', padding: 5 }}>
                                                <Text>Date: {person?.treatyDate}</Text>

                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    : null
                            );
                        })
                    }
                </ScrollView>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => goBack()}>
                        <View style={{ marginTop: 20, backgroundColor: Colors.primary, padding: 10, borderRadius: 10, width: 300, alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 20 }}>
                                Back
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <WinnersModal
                monthlyWinner={monthlyWinner}
                yearlyWinner={yearlyWinner}
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </SafeAreaView>
    )
}

export default WallOfPeace
const stylings = StyleSheet.create({
    searchBar: {
        flexDirection: 'row', backgroundColor: Colors.lightBackground, margin: 5, padding: 10, borderRadius: 10, borderColor: Colors.primary, borderWidth: 2
    },
    searchBarInput: {
        marginLeft: 8,
        marginRight: 8,
        padding: 5,
        backgroundColor: Colors.lightBackground,
        fontSize: 15,
        borderRadius: 10,
    }
    ,
    classmatesList: {
        margin: 5,
        padding: 5,
    },
    classmate: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        margin: 4,
        backgroundColor: Colors.lightBackground,
        borderRadius: 5
    },
    classmateName: {
        color: Colors.primary,
        fontWeight: 'bold'
    },
    classmateIcon: {
        borderRadius: 50,
    },
    postBtn: {
        backgroundColor: Colors.primary,
        width: '80%',
        marginLeft: '10%',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center'

    },
    classmateSchool: {
        color: Colors.text,

    },
    classmateTexts: {
        marginLeft: 9,
        padding: 2,
    },
    dots: {
        marginLeft: 95,

    },
    citizenshipStyle: {

    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: Colors.lightBackground,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    trophyIcon: {
        width: 30,
        height: 30,
        
    },
})