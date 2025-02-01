/**
 * @file Navigator.tsx
 * @description This script is responsible for controling page navigation.
 * @ownership ?
 * @last modified 9/20/2023
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EditProfile from '../screens/additive/EditProfile';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Splash from '../screens/Splash';
import UserProfile from '../screens/UserProfile';
import Post from '../screens/Post';
import Colors from '../theme/ScholarColors';
import Certificate from '../screens/Certificate';
import WallOfPeace from '../screens/WallOfPeace';
import Chats from '../screens/Chats';
import User from '../screens/User';
import ChatRoom from '../screens/ChatRoom';
import { Text } from 'react-native';
import AuthLoading from '../screens/AuthLoading';
import Settings from '../screens/Settings';
import UpdatePlan from '../screens/UpdatePlan';
import { initConnection, getProducts, requestPurchase, getAvailablePurchases, Product } from 'react-native-iap';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native-paper';

function PostStack() {
    const Stack = createNativeStackNavigator();
    const [isSubscribed,setIsSubscribed]=useState(false);
    const [loading,setLoading]=useState(false);
    const restorePurchases = async () => {
        setLoading(true);
        try {
          const purchases = await getAvailablePurchases();
          const activePurchase = purchases.find(
            (purchase) =>
              purchase.productId === 'Ate12'
          );
          if (activePurchase) {
            setIsSubscribed(true);
            setLoading(false)
            // showSucess('Subscription Restored', `Active Subscription: ${activePurchase.productId}`);
          }
          if(!activePurchase)
            setLoading(false);
        } catch (error) {
          console.error('Error restoring purchases:', error);
        }
      };

      useEffect(() => {
        const initializeIAP = async () => {
          try {
            await initConnection();
            restorePurchases();
          } catch (error) {
            console.error('IAP initialization error:', error);
          }
        };
    
        initializeIAP();
      }, []);

    return (
        <>
        { 
        loading? <ActivityIndicator style={{position:'absolute', 
            left:'45%',top:'45%'}} size={70} />
    
      :<Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      
       { !isSubscribed?<Stack.Screen name="UpdatePlan" component={UpdatePlan} /> 
        :<Stack.Screen name="Post" component={Post} /> 
}
        </Stack.Navigator>
    }
    </>
    )
}

export default PostStack;