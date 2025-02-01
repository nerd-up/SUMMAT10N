/**
 * @file DataService.js
 * @Owner Muhammad Sultan
 * @Date modified 14.10.2023
 * @purpose all database functions will be here , we can create more similar files for database operation
 *
 */

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'

import { getUserId } from '../utils/Auth';
import { showError, showSucess } from '../utils/utility';
/**
 * Dummy data
 */

export const posts = [
    {
        key: '1',
        admin: 'David Edwards',
        avatar: 'person',
        picture: 'person',
        time: '25-09-2023',
        likes: 250,
        contributes: 250,
        description:
            ' someting like that, loremiposim someting like that, loremiposim someting like that, loremiposim',
    },
    {
        key: '2',
        admin: 'David Edwards',
        avatar: 'person',
        picture: 'person',
        time: '10:49 Am',
        likes: 20,
        contributes: 180,
        description:
            ' someting like that, loremiposim someting like that, loremiposim someting like that, loremiposim',
    },
    {
        key: '3',
        admin: 'David Edwards',
        avatar: 'person',
        picture: 'person',
        time: '25-09-2023',
        likes: 300,
        contributes: 200,
        description:
            ' someting like that, loremiposim someting like that, loremiposim someting like that, loremiposim',
    },
    {
        key: '4',
        admin: 'David Edwards',
        avatar: 'person',
        picture: 'person',
        time: '25-09-2023',
        likes: 400,
        contributes: 50,
        description:
            ' someting like that, loremiposim someting like that, loremiposim someting like that, loremiposim',
    },
    {
        key: '5',
        admin: 'David Edwards',
        avatar: 'person',
        picture: 'person',
        time: '12:30 Pm',
        likes: 390,
        contributes: 150,
        description:
            ' someting like that, loremiposim someting like that, loremiposim someting like that, loremiposim',
    },
    {
        key: '6',
        admin: 'David Edwards',
        avatar: 'person',
        picture: 'person',
        time: '25-09-2023',
        likes: 300,
        contributes: 250,
        description:
            ' someting like that, loremiposim someting like that, loremiposim someting like that, loremiposim',
    },

    // Add more data items as needed
];

/**
 *
 * @param {*} userID
 * @param {*} bio
 * @param {*} profilePic
 * @param {*} residency
 * @param {*} usrName
 * @param {*} signed
 *
 * @description we can call this to set profile data or update the current profile data
 */
export function setInProfile(
    userID: string,
    bio: string,
    profilePic: string,
    residency: string,
    usrName: string,
    signed: string
) {
    console.log("userID:", userID);
    console.log("bio:", bio);
    console.log("profilePic:", profilePic);
    console.log("residency:", residency);
    console.log("usrName:", usrName);
    console.log("signed:", signed);
    firestore()
        .collection('users')
        .doc(getUserId())
        .set(
            {
                userID: userID,
                bio: bio,
                profilePic: profilePic,
                residency: residency,
                usrName: usrName,
                signed: signed
            },
            { merge: true },
        )
        .then(() => {
            console.log('success!');
        })
        .catch(err => {
            console.log("i got an error");
        });
}
export const getUsers = async () => {
    try {
        const usersRef = firestore().collection('users');
        const snapshot = await usersRef.get();

        const users: any = [];
        snapshot.forEach(doc => {
            const snp = usersRef.doc(doc.id).get();

        });

        return users;
    } catch (error) {
        console.error('Error getting users: ', error);
        throw error;
    }
};
export function fetchSignedUsers(callback: any) {
    return firestore()
        .collection('users')
        .where('signed', '!=', "") // Fetch users where 'signed' is not an empty string
        .onSnapshot(
            querySnapshot => {
                const users: any = [];
                querySnapshot.forEach(documentSnapshot => {
                    users.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id
                    });
                });
                console.log("first:", users)
                callback(users);
            },
            error => {
                console.error('Error fetching signed users in real-time:', error);
            }
        );
}
export function saveSignatures(
    signed: string
) {
    const date = new Date().toLocaleDateString();
    firestore()
        .collection('users')
        .doc(getUserId())
        .update(
            {
                signed: signed,
                treatyDate: date,
            },
        )
        .then(() => {
            console.log('success signed!');
        })
        .catch(err => {
            console.log("i got an error");
        });
}
export async function setInPost(post: {
    adminId: string;
    text: string;
    time: string;
    topic: string;
}) {
    const { adminId, text, time, topic } = post;
    try {
        const postCollection = firestore().collection('AllPosts').doc(adminId).collection('Posts');
        const currentMonth = new Date().getMonth();
        // Check if a post already exists for the current month
        const existingPostSnapshot = await postCollection
            .where('month', '==', currentMonth)
            .limit(1)
            .get();
        if (!existingPostSnapshot.empty) {
            throw new Error('You can only make one post per month.');
        }
        const newPostDoc = postCollection.doc(); // Auto-generate document ID
        const newPostId = newPostDoc.id;
        await newPostDoc.set({
            adminId,
            postId: newPostId,
            text,
            time,
            topic,
            month: currentMonth, // Store the current month for tracking
        });
        await firestore()
        .collection('users')
        .doc(adminId)
        .update({
          postdone: true,
        })
        console.log('Post successfully saved!');
    } catch (error) {
        console.error('Error saving post:', error);
        throw error;
    }
}
/**
 *
 * @param {string} userID
 * @returns a promise with the   profile data
 * @description this is used to get the user profile data, and this unction can be called in any
 * component if you have userId there
 */
export const getProfile = (userID: string) => {
    return new Promise((resolve, reject) => {
        firestore()
            .collection('users')
            .doc(userID)
            .onSnapshot(documentSnapshot => {

                if (documentSnapshot.exists) {
                    resolve(documentSnapshot.data());
                } else {
                    console.log('Profile not exists');
                }

            })
    });
}
export function deletePost(userID: string, postId:string) {
    firestore()
        .collection('AllPosts')
        .doc(userID)
        .collection('Posts')
        .doc(postId)
        .delete()
        .then(() => {
            showSucess('Success','Post Deleted successfully');
        })
        .catch(err => {
            showError('Failed to upload', err);
        });
}
export const deletePostLike = async (postID: string, userID: string) => {
    const currentUser: any = auth().currentUser?.uid;
    const likeCollectionRef = firestore()
        .collection('AllPosts')
        .doc(userID)
        .collection('Posts')
        .doc(postID)
        .collection('Likes');
    const likeQuery = likeCollectionRef.where('userID', '==', currentUser);
    likeQuery.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete()
                    .then(() => {
                        console.log("post Disliked");
                    })
                    .catch((error) => {
                        console.error('Error removing like:', error);
                    });
            });
        })
        .catch((error) => {
            console.error('Error querying likes:', error);
        });
}
export const setPostLike = async (postID: string, userID: string) => {
    const currentUser: any = auth().currentUser?.uid;
    const LikeCollection = firestore().collection('AllPosts').doc(userID).collection("Posts").doc(postID).collection('Likes');
    const newLikeDoc = LikeCollection.doc(); // This creates a new document reference with an auto-generated ID
    const likeId = newLikeDoc.id;
    console.log("likeId:" + likeId);
    console.log("userID:" + userID);
    console.log("postID:" + postID);
    firestore()
        .collection('AllPosts')
        .doc(userID)
        .collection('Posts')
        .doc(postID)
        .collection('Likes')
        .doc(likeId)
        .set({
            userID: currentUser,
            postId: postID,
            likeID: likeId
        })
        .then(() => {
            console.log('success!');
        })
        .catch(err => {
            console.log(err);
        });
}

export const setPostComment = async (postID: string, userID: string, comment: any, profilePic: any, usrName: any) => {
    const currentUser: any = auth().currentUser?.uid;
    const commentCollection = firestore().collection('AllPosts').doc(userID).collection("Posts").doc(postID).collection('Comments');
    const newCommentDoc = commentCollection.doc(); // This creates a new document reference with an auto-generated ID
    const commentId = newCommentDoc.id;
    console.log("commentId:" + commentId);
    console.log("userID:" + userID);
    console.log("postID:" + postID);
    firestore()
        .collection('AllPosts')
        .doc(userID)
        .collection('Posts')
        .doc(postID)
        .collection('Comments')
        .doc(commentId)
        .set({
            userID: currentUser,
            postId: postID,
            commentID: commentId,
            profilePic: profilePic,
            usrName: usrName,
            comment: comment
        })
        .then(() => {
            console.log('success!');
        })
        .catch(err => {
            console.log(err);
        });
}
export const getPostLikes = async (postID: string, userID: string) => {
    return new Promise((resolve, reject) => {
        const subcollectionRef = firestore()
            .collection('AllPosts')
            .doc(userID)
            .collection('Posts')
            .doc(postID)
            .collection('Likes');

        var likes: any = []

        subcollectionRef.get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    likes.push(doc.data());
                });
                resolve(likes);
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
                reject(error);
            });
    })
}

export const fetchPosts = async (userID: string) => {
    return new Promise((resolve, reject) => {
        const subcollectionRef = firestore().collection('AllPosts').doc(userID).collection('Posts');

        var posts: any = [];

        subcollectionRef.get()
            .then((querySnapshot) => {

                querySnapshot.forEach((doc) => {
                    posts.push(doc.data());
                });
                resolve(posts);
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
                reject(error);
            });
    });
}

// TODO: check if exists anywhere else in code
// export const fetchData = async () => {
//     try {
//         const profileCollection = await firestore()
//             .collectionGroup('Profile')
//             .get();

//         const profiles = profileCollection.docs.map((doc) => doc.data());

//         //console.log('All profiles:', profiles);
//         return profiles;
//     } catch (error) {
//         console.error('Error fetching profiles:', error);
//     }
// };