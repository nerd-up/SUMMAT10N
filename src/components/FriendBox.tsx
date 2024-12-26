import React, { useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';


import { posts } from '../services/DataService';
import styles from '../styles/Styles';
import Colors from '../theme/ScholarColors';
import { useNavigation } from '@react-navigation/native';

type FriendBoxProps = {
    data?: any,
    profilePic:any
}

const FriendBox = (props: FriendBoxProps) => {
	const navigation=useNavigation();
    useEffect(()=>{
        console.log("first",props.profilePic.profilePic)
    })
    return (
        <View style={styles.friendBoxStyle}>
            {
								props.profilePic.profilePic !== ""  ?
									<Image source={{ uri: props.profilePic.profilePic }} style={{
										height: 90, width
											: 90,
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
            <TouchableOpacity onPress={()=>navigation.navigate('User',{userID:props.data.userID})}>
			<Text style={styles.friendBoxTextStyle}>
                <Text>{props.data.friendName}</Text>
            </Text>
			</TouchableOpacity>
        </View>
    );
}
export default FriendBox;
