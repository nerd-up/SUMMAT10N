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
import PostStack from './PostStack';
import UpdatePlan from '../screens/UpdatePlan';

const Stack = createNativeStackNavigator();


function ScholarStack() {
    return (
        <Stack.Navigator initialRouteName="AuthLoading">
            <Stack.Screen name="AuthLoading" component={AuthLoading} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
            <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
            <Stack.Screen name="UserProfile" component={UserProfile} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfile}  />
            <Stack.Screen name="Certificate" component={Certificate}  options={{headerShown:false}}/>
            <Stack.Screen name="WallOfPeace" component={WallOfPeace}  options={{headerShown:false}}/>
            <Stack.Screen name="Chats" component={Chats} options={{headerTitle:() => <Text style={{fontSize:25,color:'black',fontWeight:'bold'}}>Chats</Text>,headerStyle:{backgroundColor:'transparent'}}}/>
            <Stack.Screen name="ChatRoom" component={ChatRoom} options={{headerBackVisible:false}}/>
            <Stack.Screen name="User" component={User}  options={{headerShown:false}}/>
            <Stack.Screen name="PostStack" component={PostStack}  options={{headerShown:false}}/>
            <Stack.Screen name="Post" component={Post} options={{title:"Make a post",headerStyle:{
                backgroundColor:Colors.lightBackground,
            }}}/>
            <Stack.Screen name="UpdatePlan" component={UpdatePlan} options={{headerBackVisible:false}} />
            {/* <Stack.Screen name="Profile" component={Profile} /> */}
      <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
    );
}

export default ScholarStack;