import { Image, ImageStyle, Platform, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React from 'react'
import { icons } from '../assets/icons';
import { useNavigation } from '@react-navigation/native';

interface Props{
    style?:ViewStyle;
    iconStyle?:ImageStyle;
    size?:number;
    color?:string
}
const BackBtn = ({style,iconStyle,size,color}:Props) => {
    const navigation=useNavigation()
  return (
   <TouchableOpacity onPress={()=>navigation.goBack()} style={[styles.container,style]}>
    <Image source={icons.back} style={[{height:size || 25,width:size || 25,tintColor:color || '#000'},iconStyle]} />
   </TouchableOpacity>
  )
}

export default BackBtn

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        left:15,
        top:Platform.OS=='ios'?45: 25,
        alignItems:'center'
    }
})