/**
 * @file Home.tsx
 * @description ?]
 * @ownership ?
 * @last modified 9/20/2023
 */

import React, { useEffect } from 'react';

import { Alert, Image, PermissionsAndroid, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import Feed from '../components/Feed';
import Colors from '../theme/ScholarColors';
import Toast from 'react-native-toast-message';
import useUserProfileStore from '../zustand/UserProfileStore';




const Home = ({ navigation }: any) => {
	const userProfile: any = useUserProfileStore(store => store)
	const displayWelcomeMessage=()=>{
		Toast.show({
			type: 'success',
			text1: "Congratulations!",
			text2: "you\'r logged in successfully!"
		});
	}
	// async function requestUserPermission() {
	// 	const authStatus = await messaging().requestPermission();
	// 	const enabled =
	// 	  authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
	// 	  authStatus === messaging.AuthorizationStatus.PROVISIONAL;
	  
	// 	if (enabled) {
	// 	  console.log('Authorization status:', authStatus);
	// 	}
	//   }
	useEffect(()=>{
		// if(Platform.OS==='ios'){
		// 	requestUserPermission();
		// }
		// PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
		displayWelcomeMessage();
		// messaging().onNotificationOpenedApp(remoteMessage => {
		// 	console.log('Notification caused app to open from background state:', JSON.stringify(remoteMessage));
		// 	// Navigate to the desired screen
		//   });
		   
		//   messaging().getInitialNotification().then(remoteMessage => {
		// 	if (remoteMessage) {
		// 	  console.log('Notification caused app to open from quit state:', JSON.stringify(remoteMessage));
		// 	  // Navigate to the desired screen
		// 	}
		//   });
		// const unsubscribe = messaging().onMessage(async remoteMessage => {
		// 	console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
		// 	// Handle the message
		//   });
	  
		// return unsubscribe;
	
		
		
		
	},[]);
    return (
        <View style={{ flex: 1,backgroundColor:Colors.lightBackground }}>
            {/* <View
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
							tintColor:Colors.primary, height: 30, width
								: 30
						}} />
					</View>
					<TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.push('Post', { userProfile })}>
						<View style={{ flex:1,width: '80%', alignItems: 'center', justifyContent: 'center' }}>
							<Text
							style={{fontSize:20 }}
							>Share your thoughts...</Text>
						</View>
					</TouchableOpacity>
					<View style={{ marginLeft: 5 }}>
						<TouchableOpacity>
                        <Image source={require('../assets/icons/images.png')} style={{
							height: 30, width
								: 30,
                            tSintColor:Colors.primary
						}} />
						</TouchableOpacity>
					</View>
				</View> */}
            <Feed />
        </View>
    );
};

export default Home;
